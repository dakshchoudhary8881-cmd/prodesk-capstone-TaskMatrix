import { useState } from 'react';
import { motion } from 'framer-motion';
import { Board } from './Board';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Search } from '@/components/ui/Search';
import { Plus, SlidersHorizontal, Share2, Check } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { PageHeader } from '@/components/layout/PageHeader';
import { Modal } from '@/components/modals/Modal';
import { CreateTaskForm } from '@/components/forms/CreateTaskForm';
import { useUserStore } from '@/store/useUserStore';
import { useTaskStore } from '@/store/useTaskStore';
import type { TaskStatus } from '@/types';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export function BoardPage() {
  const { users, fetchUsers, isLoading: isUsersLoading, error: usersError } = useUserStore();
  const { fetchTasks, isLoading: isTasksLoading, error: tasksError } = useTaskStore();

  useEffect(() => {
    fetchUsers();
    const wsId = useWorkspaceStore.getState().currentWorkspace?.id;
    fetchTasks(wsId);
  }, [fetchUsers, fetchTasks]);

  const teamMembers = users.slice(0, 3);
  const extraMembersCount = users.length > 3 ? users.length - 3 : 0;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');

  const isLoading = isUsersLoading || isTasksLoading;
  const error = usersError || tasksError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-8rem)] flex-col space-y-6"
    >
      <PageHeader
        title="Project Board"
        description="Manage your tasks and workflows across sprints."
        actions={
          <>
            <div className="flex -space-x-2 mr-2">
              {teamMembers.map((member) => (
                <Avatar
                  key={member.id}
                  src={member.avatar}
                  fallback={member.name}
                  size="sm"
                  className="ring-2 ring-white dark:ring-slate-950"
                />
              ))}
              {extraMembersCount > 0 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white dark:bg-slate-800 dark:ring-slate-950">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    +{extraMembersCount}
                  </span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-full sm:max-w-sm">
          <Search
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dropdown
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-slate-600 dark:text-slate-300"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button>
          }
        >
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Priority
          </div>
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <DropdownItem
              key={priority}
              onClick={() => {
                setFilterPriority(priority);
                setIsFilterOpen(false);
              }}
              className="flex justify-between"
            >
              <span className="capitalize">{priority}</span>
              {filterPriority === priority && <Check className="h-4 w-4 text-indigo-500" />}
            </DropdownItem>
          ))}
        </Dropdown>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {error ? (
          <div className="p-6">
            <ErrorState
              message={error}
              onRetry={() => {
                fetchUsers();
                fetchTasks();
              }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-full"
            />
          </div>
        ) : isLoading ? (
          <div className="h-full w-full flex gap-6 overflow-hidden p-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl flex flex-col p-4 gap-4"
              >
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <Board
            searchQuery={searchQuery}
            filterPriority={filterPriority}
            onCreateTask={(status) => {
              setCreateTaskStatus(status);
              setIsCreateModalOpen(true);
            }}
          />
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateTaskStatus(undefined);
        }}
        title="Create New Task"
      >
        <CreateTaskForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setCreateTaskStatus(undefined);
          }}
          initialData={createTaskStatus ? ({ status: createTaskStatus } as any) : undefined}
        />
      </Modal>
    </motion.div>
  );
}
