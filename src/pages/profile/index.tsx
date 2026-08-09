import { motion } from 'framer-motion';
import {
  Camera,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Globe,
  Code,
  Briefcase,
  Activity,
  FolderKanban,
  CheckSquare,
  Award,
  Clock,
  Target,
  PenSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useTaskStore } from '@/store/useTaskStore';
import { ReportService } from '@/services/ReportService';
import { cn } from '@/utils/cn';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
const getProfileData = (user: any): any => {
  if (!user) return null;
  return {
    ...user,
    bio: "Lead Software Engineer with a passion for building scalable web applications and intuitive user interfaces. When I'm not coding, I'm probably hiking or brewing specialty coffee.",
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    website: 'https://alexchen.dev',
    social: {
      twitter: '@alexchen',
      github: 'alexchen-dev',
      linkedin: 'in/alexchen',
    },
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Framer Motion',
      'Tailwind CSS',
      'GraphQL',
      'AWS',
    ],
    achievements: [
      {
        title: 'Top Contributor',
        desc: 'Most commits in Q2 2026',
        icon: Award,
        color: 'text-amber-500',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
      },
      {
        title: 'Bug Squasher',
        desc: 'Resolved 100+ critical bugs',
        icon: Target,
        color: 'text-emerald-500',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      },
      {
        title: 'Speed Demon',
        desc: 'Fastest average PR review time',
        icon: Activity,
        color: 'text-purple-500',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
      },
    ],
  };
};

export function Profile() {
  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    ReportService.getActivities().then(setActivities);
  }, [fetchProjects, fetchTasks]);

  const profile = getProfileData(user);
  const userProjects = projects.filter((p) => (p.memberIds || []).includes(user?.id || ''));
  const userTasks = tasks.filter((t) => t.assigneeId === user?.id);
  const completedTasksCount = userTasks.filter((t) => t.status === 'done').length;

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Banner & Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Cover change requested')}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white border-white/30 backdrop-blur-md"
          >
            <Camera className="w-4 h-4 mr-2" /> Change Cover
          </Button>
        </div>

        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 mb-6 gap-4">
            <div className="flex items-end gap-6 relative">
              <div className="relative group">
                <Avatar
                  src={profile.avatar}
                  fallback="AC"
                  className="w-32 h-32 text-4xl ring-4 ring-white dark:ring-slate-900 bg-slate-100 shadow-xl"
                />
                <button
                  onClick={() => toast.success('Avatar change requested')}
                  className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-700"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left mt-16 sm:mt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {profile.name}
                  <Badge
                    variant="secondary"
                    className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"
                  >
                    Pro
                  </Badge>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-1">
                  {profile.role} • {profile.department}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 opacity-70" /> {profile.location}
                  </span>
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1.5 opacity-70" /> {profile.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1.5 opacity-70" /> {profile.phone}
                  </span>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <LinkIcon className="w-4 h-4 mr-1.5" />{' '}
                    {profile.website.replace('https://', '')}
                  </a>
                </div>{' '}
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Link to="/settings">
                <Button className="w-full md:w-auto">
                  <PenSquare className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              {profile.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact & Social */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4">
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="hover:text-indigo-600 cursor-pointer">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {profile.website.replace('https://', '')}
                </a>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 grid grid-cols-3 gap-3">
                <Button variant="outline" className="w-full text-slate-600">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full text-slate-600">
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full text-slate-600">
                  <Briefcase className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4">
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium px-3 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Stats Box */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 text-center">
              <div className="h-10 w-10 mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-2">
                <CheckSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
                {completedTasksCount}
              </h4>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">
                Tasks Done
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
              <div className="h-10 w-10 mx-auto bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-2">
                <FolderKanban className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
                {userProjects.length}
              </h4>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">
                Projects
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Achievements */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50/50 dark:bg-slate-900/20">
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.achievements.map((ach: any, i: number) => {
                  const Icon = ach.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                    >
                      <div
                        className={cn(
                          'h-12 w-12 rounded-full flex items-center justify-center mb-3',
                          ach.bg
                        )}
                      >
                        <Icon className={cn('h-6 w-6', ach.color)} />
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{ach.desc}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Projects */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4">
              <CardTitle className="text-lg flex items-center justify-between">
                Current Projects
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {userProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {project.name}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-4 min-w-[150px]">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            Progress
                          </span>
                          <span className="text-indigo-600 font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4 bg-slate-50/50 dark:bg-slate-900/20">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                {activities
                  .filter((a) => a.userId === profile.id)
                  .map((activity) => (
                    <div key={activity.id} className="relative flex gap-4">
                      <div className="absolute -left-[5px] top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white dark:bg-slate-900 z-10" />
                      <div className="pl-6 flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {profile.name}
                          </span>{' '}
                          {activity.action}{' '}
                          <span className="font-medium text-slate-900 dark:text-white">
                            {activity.targetName}
                          </span>{' '}
                          {activity.details}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.createdAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
