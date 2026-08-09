import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  Plus,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  CheckSquare,
  CalendarDays,
  ArrowUpRight,
  Zap,
  FolderKanban,
} from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ReportService } from '@/services/ReportService';
import { useUserStore } from '@/store/useUserStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { PageHeader } from '@/components/layout/PageHeader';
import { Modal } from '@/components/modals/Modal';
import { CreateProjectForm } from '@/components/forms/CreateProjectForm';
import { CreateTaskForm } from '@/components/forms/CreateTaskForm';
import { EmptyState } from '@/components/ui/EmptyState';

const COLORS = ['#6366f1', '#eab308', '#f97316', '#22c55e'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const { tasks, fetchTasks } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const { users, fetchUsers } = useUserStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const wsId = useWorkspaceStore.getState().currentWorkspace?.id;
      await Promise.all([fetchTasks(wsId), fetchProjects(wsId), fetchUsers()]);
      const fetchedActivities = await ReportService.getActivities();
      setActivities(fetchedActivities);
      setIsLoading(false);
    };
    loadData();
  }, [fetchTasks, fetchProjects, fetchUsers]);

  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: ListTodo,
      color: 'text-indigo-500 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    },
    {
      label: 'In Progress',
      value: tasks.filter((t) => t.status === 'in-progress').length,
      icon: Clock,
      color: 'text-yellow-500 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-500/10',
    },
    {
      label: 'In Review',
      value: tasks.filter((t) => t.status === 'review').length,
      icon: TrendingUp,
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      label: 'Completed',
      value: tasks.filter((t) => t.status === 'done').length,
      icon: CheckCircle2,
      color: 'text-green-500 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-500/10',
    },
  ];

  const pieData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: COLORS[0] },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: COLORS[1] },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: COLORS[2] },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: COLORS[3] }
  ].filter(d => d.value > 0);

  // Generate dynamic weekly activity
  // In a real app this would query logs, here we map tasks based on createdAt as an approximation
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  const barData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    
    // Tasks added on this day
    const added = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      return taskDate.getDate() === d.getDate() && taskDate.getMonth() === d.getMonth() && taskDate.getFullYear() === d.getFullYear();
    }).length;

    // Tasks completed on this day (Mock approximation using dueDate if done, else random or 0. Since we don't track completion date accurately without logs, we'll approximate based on status === 'done' and dueDate today)
    const completed = tasks.filter(t => {
      if (t.status !== 'done') return false;
      const taskDate = t.dueDate ? new Date(t.dueDate) : new Date(t.createdAt);
      return taskDate.getDate() === d.getDate() && taskDate.getMonth() === d.getMonth() && taskDate.getFullYear() === d.getFullYear();
    }).length;

    return { name: dayName, completed, added };
  });

  // Derive quick actions, upcoming deadlines, team members from mock
  const upcomingDeadlines = tasks
    .filter((t) => t.dueDate && t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  const teamMembers = users.filter((u) => u.id !== user?.id).slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 h-28">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="h-[350px] p-6">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="h-[350px] p-6">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <PageHeader
        title="Dashboard Overview"
        description={`Welcome back, ${user?.name || 'User'}! Here's what's happening with your projects today.`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('Downloading report...')}
            >
              Download Report
            </Button>
            <Button size="sm" onClick={() => setIsCreateProjectModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </>
        }
      />

      {/* Analytics Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="transition-transform hover:-translate-y-1 duration-300 group cursor-default"
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`p-4 rounded-xl transition-colors ${stat.bg}`}>
                <stat.icon
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${stat.color}`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <BarChart
                data={barData}
                keys={{ x: 'name', y: ['completed', 'added'] }}
                colors={['#22c55e', '#6366f1']}
                height="100%"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <PieChart data={pieData} colors={COLORS} height="100%" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Projects & Activity */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Team</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <EmptyState
                            title="No active projects"
                            description="Create a project to get started."
                            icon={<FolderKanban className="h-8 w-8 text-slate-400" />}
                            action={
                              <Button size="sm" onClick={() => setIsCreateProjectModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Project
                              </Button>
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      projects.slice(0, 4).map((project) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                project.status === 'completed'
                                  ? 'success'
                                  : project.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${project.progress}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className={`h-full ${project.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                                />
                              </div>
                              <span className="text-xs text-slate-500">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end -space-x-2">
                              {(project.memberIds || []).slice(0, 3).map((id, i) => {
                                const member = users.find((u) => u.id === id);
                                return (
                                  <Avatar
                                    key={i}
                                    fallback={member?.name || id}
                                    src={member?.avatar}
                                    size="sm"
                                    className="ring-2 ring-white dark:ring-slate-900"
                                  />
                                );
                              })}
                              {(project.memberIds || []).length > 3 && (
                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                                  +{(project.memberIds || []).length - 3}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Plus,
                      label: 'Create Task',
                      bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                      onClick: () => setIsCreateTaskModalOpen(true),
                    },
                    {
                      icon: MessageSquare,
                      label: 'New Message',
                      bg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                      onClick: () => toast.success('Messaging feature coming soon!'),
                    },
                    {
                      icon: CalendarDays,
                      label: 'Schedule',
                      bg: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
                      onClick: () => navigate('/calendar'),
                    },
                    {
                      icon: Zap,
                      label: 'Automations',
                      bg: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
                      onClick: () => toast.success('Automations panel opened'),
                    },
                  ].map((action, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.onClick}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-2"
                    >
                      <div className={`p-2 rounded-lg ${action.bg}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Online</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => navigate('/team')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar src={member.avatar} fallback={member.name} size="sm" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toast.success(`Messaging ${member.name}...`)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MessageSquare className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Deadlines & Activity */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {upcomingDeadlines.length > 0 ? (
                  upcomingDeadlines.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-2 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-100 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          {new Date(task.dueDate!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No upcoming deadlines"
                    description="You're all caught up on your tasks!"
                    icon={<CheckCircle2 className="h-8 w-8 text-emerald-500" />}
                    className="py-4"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 group">
                    <div className="relative mt-1">
                      <div className="absolute top-8 bottom-[-24px] left-1/2 -translate-x-1/2 w-px bg-slate-200 dark:bg-slate-800 group-last:hidden" />
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900 z-10 relative">
                        {activity.action.includes('task') ? (
                          <CheckSquare className="h-4 w-4 text-emerald-500" />
                        ) : activity.action.includes('project') ? (
                          <FolderKanban className="h-4 w-4 text-indigo-500" />
                        ) : (
                          <Paperclip className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {users.find((u) => u.id === activity.userId)?.name || 'Someone'}
                        </span>{' '}
                        {activity.action}{' '}
                        <span className="font-medium text-slate-900 dark:text-white">
                          {activity.targetName}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(activity.createdAt).toLocaleDateString()} at{' '}
                        {new Date(activity.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={() => toast.success('Activity logs loading...')}
                className="w-full mt-6 text-sm text-indigo-600 dark:text-indigo-400"
              >
                View all activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <Modal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        title="Create New Project"
      >
        <CreateProjectForm onSuccess={() => setIsCreateProjectModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        title="Create New Task"
      >
        <CreateTaskForm onSuccess={() => setIsCreateTaskModalOpen(false)} />
      </Modal>
    </motion.div>
  );
}
