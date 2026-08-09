import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar as CalendarIcon, TrendingUp, Target, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '@/components/layout/PageHeader';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { RefreshCcw, FileText, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useProjectStore } from '@/store/useProjectStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useUserStore } from '@/store/useUserStore';
import { ReportService } from '@/services/ReportService';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';

// Dynamic calculations will be performed in the component

export function Reports() {
  const {
    projects,
    fetchProjects,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useProjectStore();
  const { tasks, fetchTasks, isLoading: isTasksLoading, error: tasksError } = useTaskStore();
  const { users, fetchUsers, isLoading: isUsersLoading, error: usersError } = useUserStore();

  const [reportsData, setReportsData] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchUsers();
    ReportService.getReports().then((reports) => {
      setReportsData(reports);
      setIsDataLoading(false);
    });
  }, [fetchProjects, fetchTasks, fetchUsers]);

  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [projectFilter, setProjectFilter] = useState('All Projects');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [tableExportMenuId, setTableExportMenuId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    Promise.all([
      fetchProjects(),
      fetchTasks(),
      fetchUsers(),
      ReportService.getReports().then(setReportsData),
    ]).finally(() => {
      setIsRefreshing(false);
      toast.success('Dashboard data refreshed');
    });
  };

  const isLoading = isProjectsLoading || isTasksLoading || isUsersLoading || isDataLoading;
  const error = projectsError || tasksError || usersError;

  // Stats derived from DB
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100) || 0;

  const activeProjects = projects.filter((p) => p.status !== 'Completed').length;
  const totalMembers = users.length;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  const productivityData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    
    const added = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      return taskDate.getDate() === d.getDate() && taskDate.getMonth() === d.getMonth() && taskDate.getFullYear() === d.getFullYear();
    }).length;

    const completed = tasks.filter(t => {
      if (t.status !== 'done') return false;
      const taskDate = t.dueDate ? new Date(t.dueDate) : new Date(t.createdAt);
      return taskDate.getDate() === d.getDate() && taskDate.getMonth() === d.getMonth() && taskDate.getFullYear() === d.getFullYear();
    }).length;

    return { name: dayName, completed, added };
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const completionData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - (5 - i));
    const monthName = months[d.getMonth()];

    const monthTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      return taskDate.getMonth() === d.getMonth() && taskDate.getFullYear() === d.getFullYear();
    });

    const completedInMonth = monthTasks.filter(t => t.status === 'done').length;
    const rate = monthTasks.length > 0 ? Math.round((completedInMonth / monthTasks.length) * 100) : 0;

    return { month: monthName, rate };
  });

  if (error) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reports & Analytics"
          description="Measure team velocity, project health, and overall productivity."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PageHeader
        title="Reports & Analytics"
        description="Measure team velocity, project health, and overall productivity."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-slate-600 dark:text-slate-300"
            >
              <RefreshCcw className={cn('mr-2 h-4 w-4', isRefreshing && 'animate-spin')} />
              Refresh
            </Button>

            <Dropdown
              isOpen={isProjectMenuOpen}
              onClose={() => setIsProjectMenuOpen(false)}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                  className="bg-white dark:bg-slate-900"
                >
                  <Target className="mr-2 h-4 w-4 text-indigo-500" />
                  {projectFilter}
                </Button>
              }
            >
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Filter by Project
              </div>
              {['All Projects', ...projects.map((p) => p.name)].map((project) => (
                <DropdownItem
                  key={project}
                  onClick={() => {
                    setProjectFilter(project);
                    setIsProjectMenuOpen(false);
                  }}
                  className="flex justify-between"
                >
                  <span className="truncate max-w-[150px]">{project}</span>
                  {projectFilter === project && (
                    <Check className="h-4 w-4 text-indigo-500 shrink-0" />
                  )}
                </DropdownItem>
              ))}
            </Dropdown>

            <Dropdown
              isOpen={isDateMenuOpen}
              onClose={() => setIsDateMenuOpen(false)}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                  className="bg-white dark:bg-slate-900"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                  {dateRange}
                </Button>
              }
            >
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date Range
              </div>
              {['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'This Year'].map(
                (range) => (
                  <DropdownItem
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setIsDateMenuOpen(false);
                    }}
                    className="flex justify-between"
                  >
                    <span>{range}</span>
                    {dateRange === range && <Check className="h-4 w-4 text-indigo-500" />}
                  </DropdownItem>
                )
              )}
            </Dropdown>

            <Dropdown
              isOpen={isExportMenuOpen}
              onClose={() => setIsExportMenuOpen(false)}
              trigger={
                <Button size="sm" onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              }
            >
              <DropdownItem
                icon={<FileText className="h-4 w-4" />}
                onClick={() => {
                  toast.success('Downloading CSV...');
                  setIsExportMenuOpen(false);
                }}
              >
                Download CSV
              </DropdownItem>
              <DropdownItem
                icon={<Download className="h-4 w-4" />}
                onClick={() => {
                  toast.success('Downloading PDF...');
                  setIsExportMenuOpen(false);
                }}
              >
                Download PDF
              </DropdownItem>
            </Dropdown>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Target className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" /> +12%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Task Completion
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {completionRate}%
            </h3>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" /> +8%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Projects
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {activeProjects}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-full">
                No change
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Team Members</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalMembers}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" /> +15%
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Velocity</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">48 pts</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Productivity */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg">Productivity Over Time (Area Chart)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={productivityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    name="Completed Tasks"
                  />
                  <Area
                    type="monotone"
                    dataKey="added"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAdded)"
                    name="Added Tasks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Weekly Activity */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg">Weekly Activity (Bar Chart)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <BarChart
              data={productivityData}
              keys={{ x: 'name', y: ['completed', 'added'] }}
              colors={['#8b5cf6', '#e2e8f0']}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Line Chart: Completion Rate */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg">Completion Rate Trend (Line Chart)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={completionData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    name="Completion %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart: Task Distribution */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <CardTitle className="text-lg">Task Status Distribution (Pie Chart)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <PieChart
              data={[
                { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#cbd5e1' },
                { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#6366f1' },
                { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#f59e0b' },
                { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#10b981' }
              ].filter(d => d.value > 0)}
              colors={['#cbd5e1', '#6366f1', '#f59e0b', '#10b981']}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Generated Reports</CardTitle>
            <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Report Name</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Generated By</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {reportsData.map((report) => {
                  const author = users.find((u) => u.id === report.generatedBy);
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {report.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {author?.name || 'System'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Dropdown
                          isOpen={tableExportMenuId === report.id}
                          onClose={() => setTableExportMenuId(null)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                setTableExportMenuId(
                                  tableExportMenuId === report.id ? null : report.id
                                )
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          }
                        >
                          <DropdownItem
                            icon={<FileText className="h-4 w-4" />}
                            onClick={() => {
                              toast.success(`Downloading ${report.title} (CSV)...`);
                              setTableExportMenuId(null);
                            }}
                          >
                            Download CSV
                          </DropdownItem>
                          <DropdownItem
                            icon={<Download className="h-4 w-4" />}
                            onClick={() => {
                              toast.success(`Downloading ${report.title} (PDF)...`);
                              setTableExportMenuId(null);
                            }}
                          >
                            Download PDF
                          </DropdownItem>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
