import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Calendar,
  CheckSquare,
  Paperclip,
  Activity,
  Tag,
  User,
  Flag,
  MoreHorizontal,
  FileText,
  ChevronRight,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useTaskStore } from '@/store/useTaskStore';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import type { Task } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { useProjectStore } from '@/store/useProjectStore';
import { TaskService } from '@/services/TaskService';

interface TaskDetailsPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsPanel({ task, isOpen, onClose }: TaskDetailsPanelProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask, deleteTask } = useTaskStore();
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (isOpen && task) {
      setEditedTask(task);
      setIsEditing(false);
    }
  }, [isOpen, task]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!task) return null;

  const { users } = useUserStore();
  const { projects } = useProjectStore();

  // Assignee could be a populated object {id, name, email, avatar} or a string ID
  const assigneeObj = typeof task.assignee === 'object' && task.assignee
    ? task.assignee as any
    : null;
  const assignee = assigneeObj
    ? { name: assigneeObj.name, avatar: assigneeObj.avatar }
    : users.find((u) => u.id === task.assigneeId)
    || { name: 'Unassigned', avatar: undefined };

  const reporterObj = typeof task.reporter === 'object' && task.reporter
    ? task.reporter as any
    : null;
  const reporter = reporterObj
    ? { name: reporterObj.name, avatar: reporterObj.avatar }
    : users.find((u) => u.id === task.reporterId) || users[0] || { name: 'Unknown', avatar: undefined };

  const [comments, setComments] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task?.id && isOpen) {
      TaskService.getTaskComments(task.id).then(setComments).catch(console.error);
      TaskService.getTaskAttachments(task.id).then(setAttachments).catch(console.error);
    }
  }, [task?.id, isOpen]);

  // Mock subtasks
  const [subtasks, setSubtasks] = useState([
    { id: 1, title: 'Define data structure', completed: true },
    {
      id: 2,
      title: 'Create API endpoints',
      completed: task.status === 'done' || task.status === 'review',
    },
    { id: 3, title: 'Integrate UI components', completed: task.status === 'done' },
  ]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const added = await TaskService.addComment(task.id, {
        content: newComment,
      });
      setComments([...comments, added]);
      setNewComment('');
      toast.success('Comment added');
    } catch (e) {
      toast.error('Failed to add comment');
    }
  };

  const toggleSubtask = (id: number) => {
    setSubtasks(subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const handleSave = async () => {
    if (editedTask) {
      updateTask(editedTask.id, editedTask);
      toast.success('Task updated successfully');
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const statusColors = {
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'in-progress': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    review: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  const labelColors: Record<string, string> = {
    bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    feature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    design: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    frontend: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    backend: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-slate-950 sm:w-[500px] md:w-[600px] xl:w-[700px] border-l border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  >
                    {task.id}
                  </Badge>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <span>Projects</span>
                    <ChevronRight className="h-3.5 w-3.5 mx-1" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {projects.find((p) => p.id === task.projectId)?.name || 'Project'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Dropdown
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownItem
                          icon={<Edit2 className="h-4 w-4" />}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsEditing(true);
                          }}
                        >
                          Edit Task
                        </DropdownItem>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                        <DropdownItem
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => {
                            setIsMenuOpen(false);
                            deleteTask(task.id);
                            toast.success('Task deleted');
                            onClose();
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete Task
                        </DropdownItem>
                      </Dropdown>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-slate-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Content Scrollable */}
              <div className="flex-1 overflow-y-auto kanban-scrollbar p-6">
                <div className="mb-8">
                  {isEditing && editedTask ? (
                    <input
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                      className="w-full text-2xl font-bold text-slate-900 dark:text-white mb-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                      {task.title}
                    </h2>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm mb-6 border-b border-slate-100 pb-6 dark:border-slate-800/60">
                    {/* Status & Priority Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isEditing && editedTask ? (
                        <>
                          <select
                            value={editedTask.status}
                            onChange={(e) =>
                              setEditedTask({ ...editedTask, status: e.target.value as any })
                            }
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                          <select
                            value={editedTask.priority}
                            onChange={(e) =>
                              setEditedTask({ ...editedTask, priority: e.target.value as any })
                            }
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </>
                      ) : (
                        <>
                          <div
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold capitalize',
                              statusColors[task.status]
                            )}
                          >
                            <Activity className="h-3.5 w-3.5" />
                            {task.status.replace('-', ' ')}
                          </div>
                          <div
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold capitalize',
                              priorityColors[task.priority]
                            )}
                          >
                            <Flag className="h-3.5 w-3.5" />
                            {task.priority} Priority
                          </div>
                        </>
                      )}
                    </div>

                    {/* Labels */}
                    {task.labels && task.labels.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        {task.labels.map((label) => (
                          <span
                            key={label}
                            className={cn(
                              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide',
                              labelColors[label.toLowerCase()] ||
                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            )}
                          >
                            <Tag className="h-3 w-3" />
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 p-4 bg-slate-50/50 rounded-xl border border-slate-100 dark:bg-slate-900/30 dark:border-slate-800/60">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Assignee
                      </span>
                      {isEditing && editedTask ? (
                        <select
                          value={editedTask.assigneeId || ''}
                          onChange={(e) =>
                            setEditedTask({ ...editedTask, assigneeId: e.target.value })
                          }
                          className="w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Unassigned</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <Avatar src={assignee.avatar} fallback={assignee.name} size="sm" />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {assignee.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Reporter
                      </span>
                      <div className="flex items-center gap-2 pt-1">
                        <Avatar src={reporter.avatar} fallback={reporter.name} size="sm" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {reporter.name}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 mt-2">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Due Date
                      </span>
                      <p
                        className={cn(
                          'text-sm font-medium pt-1',
                          task.dueDate && new Date(task.dueDate) < new Date()
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-slate-900 dark:text-white'
                        )}
                      >
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'No due date'}
                      </p>
                    </div>
                    <div className="space-y-1 mt-2">
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> Created At
                      </span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white pt-1">
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-white mb-3">
                      <FileText className="h-4 w-4 text-slate-500" /> Description
                    </h3>
                    {isEditing && editedTask ? (
                      <textarea
                        value={editedTask.description || ''}
                        onChange={(e) =>
                          setEditedTask({ ...editedTask, description: e.target.value })
                        }
                        className="w-full min-h-[120px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                        placeholder="Add a detailed description..."
                      />
                    ) : (
                      <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        {task.description ? (
                          <p className="whitespace-pre-wrap">{task.description}</p>
                        ) : (
                          <p className="italic text-slate-400">No description provided.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Subtasks */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                        <CheckSquare className="h-4 w-4 text-slate-500" /> Subtasks
                      </h3>
                      <span className="text-xs font-medium text-slate-500">
                        {completedSubtasks} / {subtasks.length}
                      </span>
                    </div>
                    <ProgressBar
                      value={(completedSubtasks / subtasks.length) * 100}
                      className="mb-4 h-1.5"
                      indicatorClassName={
                        completedSubtasks === subtasks.length ? 'bg-emerald-500' : 'bg-indigo-500'
                      }
                    />
                    <div className="space-y-2">
                      {subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          onClick={() => toggleSubtask(subtask.id)}
                          className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 transition-colors cursor-pointer group"
                        >
                          <div
                            className={cn(
                              'mt-0.5 h-4 w-4 shrink-0 rounded flex items-center justify-center border transition-colors',
                              subtask.completed
                                ? 'bg-indigo-500 border-indigo-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
                            )}
                          >
                            {subtask.completed && <CheckSquare className="h-3 w-3" />}
                          </div>
                          <span
                            className={cn(
                              'text-sm transition-colors',
                              subtask.completed
                                ? 'text-slate-400 line-through decoration-slate-300 dark:decoration-slate-700'
                                : 'text-slate-700 dark:text-slate-300'
                            )}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.success('Mock backend: Subtask added!')}
                      className="mt-2 w-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                    >
                      + Add Subtask
                    </Button>
                  </div>

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-white mb-3">
                        <Paperclip className="h-4 w-4 text-slate-500" /> Attachments (
                        {attachments.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-colors group cursor-pointer"
                          >
                            <div className="h-10 w-10 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-indigo-500 transition-colors">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                {att.fileName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(att.fileSize / 1024).toFixed(1)} KB •{' '}
                                {att.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments / Activity Feed */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-900 dark:text-white mb-4">
                      <Activity className="h-4 w-4 text-slate-500" /> Activity & Comments
                    </h3>

                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                      {/* System Activity */}
                      <div className="flex gap-4 relative">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-950 flex items-center justify-center z-10">
                          <Flag className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium text-slate-900 dark:text-white">
                              {reporter.name}
                            </span>{' '}
                            created this task
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(task.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Comments */}
                      {comments.map((comment) => {
                        const authorPopulated = typeof comment.author === 'object' && comment.author
                          ? comment.author as any : null;
                        const author = authorPopulated
                          || users.find((u) => u.id === comment.authorId)
                          || { name: 'Unknown', avatar: undefined };
                        return (
                          <div key={comment.id} className="flex gap-4 relative">
                            <Avatar
                              src={author?.avatar}
                              fallback={author?.name || 'U'}
                              className="h-10 w-10 shrink-0 ring-4 ring-white dark:ring-slate-950 z-10"
                            />
                            <div className="flex-1">
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl rounded-tl-none p-4 border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {author?.name}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {new Date(comment.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Comment Input */}
                    <div className="mt-6 flex gap-4">
                      <Avatar
                        src="https://i.pravatar.cc/150?u=current_user"
                        fallback="ME"
                        className="h-10 w-10 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="relative">
                          <textarea
                            placeholder="Add a comment or update..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full min-h-[100px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                          />
                          <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toast.success('Mock backend: Attachment added!')}
                              className="h-8 w-8 text-slate-400 hover:text-slate-600"
                            >
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="h-8" onClick={handleAddComment}>
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
