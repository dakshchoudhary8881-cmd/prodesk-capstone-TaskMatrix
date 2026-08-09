import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  Bell,
  Palette,
  Shield,
  CreditCard,
  AlertTriangle,
  Key,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { PageHeader } from '@/components/layout/PageHeader';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

const workspaceSchema = z.object({
  name: z.string().min(3, 'Workspace name must be at least 3 characters'),
  url: z.string().url('Invalid URL format'),
});
type WorkspaceFormData = z.infer<typeof workspaceSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
type PasswordFormData = z.infer<typeof passwordSchema>;
type Tab =
  'profile' | 'workspace' | 'notifications' | 'appearance' | 'security' | 'billing' | 'danger';

const SETTINGS_TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Briefcase },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security & API', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [copiedKey, setCopiedKey] = useState(false);

  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [language, setLanguage] = useState('English (US)');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      bio: '',
    },
  });

  const workspaceForm = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: 'Acme Corp',
      url: 'https://acme-corp.taskmatrix.com',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile saved:', data);
    toast.success('Profile updated successfully');
  };

  const onWorkspaceSubmit = (data: WorkspaceFormData) => {
    console.log('Workspace saved:', data);
    toast.success('Workspace updated successfully');
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log('Password changed:', data);
    toast.success('Password updated successfully');
    passwordForm.reset();
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('sk_test_1234567890abcdef');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <PageHeader title="Settings" description="Manage your account settings and preferences." />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 kanban-scrollbar">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-300'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0',
                      activeTab === tab.id
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400'
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>Public Profile</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        This information will be displayed publicly.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-slate-950 shadow-sm">
                          <span className="text-xl font-bold text-slate-400">
                            {user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm">
                            Change Avatar
                          </Button>
                          <p className="text-xs text-slate-500">
                            JPG, GIF or PNG. Max size of 2MB.
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              First Name
                            </label>
                            <Input placeholder="Alex" {...profileForm.register('firstName')} />
                            {profileForm.formState.errors.firstName && (
                              <p className="text-xs text-red-500">
                                {profileForm.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Last Name
                            </label>
                            <Input placeholder="Chen" {...profileForm.register('lastName')} />
                            {profileForm.formState.errors.lastName && (
                              <p className="text-xs text-red-500">
                                {profileForm.formState.errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email
                          </label>
                          <Input
                            type="email"
                            placeholder="alex.chen@example.com"
                            {...profileForm.register('email')}
                          />
                          {profileForm.formState.errors.email && (
                            <p className="text-xs text-red-500">
                              {profileForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Bio
                          </label>
                          <textarea
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 min-h-[100px]"
                            placeholder="Tell us a little bit about yourself"
                            {...profileForm.register('bio')}
                          ></textarea>
                          {profileForm.formState.errors.bio && (
                            <p className="text-xs text-red-500">
                              {profileForm.formState.errors.bio.message}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'workspace' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>Workspace Settings</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your team's general workspace preferences.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form
                        onSubmit={workspaceForm.handleSubmit(onWorkspaceSubmit)}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Workspace Name
                          </label>
                          <Input placeholder="Acme Corp" {...workspaceForm.register('name')} />
                          {workspaceForm.formState.errors.name && (
                            <p className="text-xs text-red-500">
                              {workspaceForm.formState.errors.name.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Workspace URL
                          </label>
                          <Input
                            placeholder="https://acme-corp.taskmatrix.com"
                            {...workspaceForm.register('url')}
                          />
                          {workspaceForm.formState.errors.url && (
                            <p className="text-xs text-red-500">
                              {workspaceForm.formState.errors.url.message}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end pt-4">
                          <Button type="submit" disabled={workspaceForm.formState.isSubmitting}>
                            Update Workspace
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>Email Notifications</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Choose what updates you want to receive via email.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Checkbox id="notif-mentions" />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="notif-mentions"
                              className="text-sm font-medium leading-none text-slate-900 dark:text-white cursor-pointer"
                            >
                              Mentions
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Receive an email when you are mentioned in a task or comment.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox id="notif-assignments" />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="notif-assignments"
                              className="text-sm font-medium leading-none text-slate-900 dark:text-white cursor-pointer"
                            >
                              Task Assignments
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Receive an email when a new task is assigned to you.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Checkbox id="notif-updates" />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="notif-updates"
                              className="text-sm font-medium leading-none text-slate-900 dark:text-white cursor-pointer"
                            >
                              Project Updates
                            </label>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Receive a daily digest of all project activity.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <Button onClick={() => toast.success('Preferences saved')}>
                          Save Preferences
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>Theme Preferences</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Customize the UI theme of your dashboard.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={cn(
                            'flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors',
                            theme === 'light'
                              ? 'border-indigo-500 bg-indigo-50/10'
                              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500'
                          )}
                        >
                          <div className="w-full h-20 bg-slate-100 rounded-lg overflow-hidden shadow-inner flex">
                            <div className="w-1/3 h-full bg-slate-200" />
                            <div className="w-2/3 h-full bg-white flex flex-col gap-2 p-2">
                              <div className="w-full h-2 bg-slate-200 rounded" />
                              <div className="w-1/2 h-2 bg-slate-200 rounded" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            Light
                          </span>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={cn(
                            'flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors',
                            theme === 'dark'
                              ? 'border-indigo-500 bg-indigo-50/10'
                              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500'
                          )}
                        >
                          <div className="w-full h-20 bg-slate-900 rounded-lg overflow-hidden shadow-inner flex">
                            <div className="w-1/3 h-full bg-slate-800" />
                            <div className="w-2/3 h-full bg-slate-950 flex flex-col gap-2 p-2">
                              <div className="w-full h-2 bg-slate-800 rounded" />
                              <div className="w-1/2 h-2 bg-slate-800 rounded" />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            Dark
                          </span>
                        </button>
                        <button
                          onClick={() => setTheme('system')}
                          className={cn(
                            'flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors',
                            theme === 'system'
                              ? 'border-indigo-500 bg-indigo-50/10'
                              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500'
                          )}
                        >
                          <div className="w-full h-20 bg-gradient-to-r from-slate-100 to-slate-900 rounded-lg overflow-hidden shadow-inner flex">
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium bg-slate-900/10 dark:bg-slate-100/10">
                              Auto
                            </div>
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            System
                          </span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>Language</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Select your preferred language.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Dropdown
                        isOpen={isLangMenuOpen}
                        onClose={() => setIsLangMenuOpen(false)}
                        trigger={
                          <Button
                            variant="outline"
                            className="w-[200px] justify-between"
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                          >
                            {language}
                          </Button>
                        }
                      >
                        {['English (US)', 'Spanish (ES)', 'French (FR)', 'German (DE)'].map(
                          (lang) => (
                            <DropdownItem
                              key={lang}
                              onClick={() => {
                                setLanguage(lang);
                                setIsLangMenuOpen(false);
                                toast.success('Language updated');
                              }}
                              className="flex justify-between"
                            >
                              <span>{lang}</span>
                              {language === lang && <Check className="h-4 w-4 text-indigo-500" />}
                            </DropdownItem>
                          )
                        )}
                      </Dropdown>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>Change Password</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Update your password to keep your account secure.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form
                        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Current Password
                          </label>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...passwordForm.register('currentPassword')}
                          />
                          {passwordForm.formState.errors.currentPassword && (
                            <p className="text-xs text-red-500">
                              {passwordForm.formState.errors.currentPassword.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              New Password
                            </label>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...passwordForm.register('newPassword')}
                            />
                            {passwordForm.formState.errors.newPassword && (
                              <p className="text-xs text-red-500">
                                {passwordForm.formState.errors.newPassword.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Confirm New Password
                            </label>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...passwordForm.register('confirmPassword')}
                            />
                            {passwordForm.formState.errors.confirmPassword && (
                              <p className="text-xs text-red-500">
                                {passwordForm.formState.errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                            Update Password
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>API Keys</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your secret API keys for external integrations.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Key className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              Production Key
                            </p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              sk_test_••••••••••••cdef
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={copyApiKey}>
                          {copiedKey ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => toast.success('New API key generated')}
                        >
                          Generate New Key
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                      <CardTitle>Current Plan</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        You are currently on the Pro plan.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg mb-6">
                        <div>
                          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-3">
                            Pro Plan
                          </Badge>
                          <h3 className="text-3xl font-bold mb-1">$29.00 / month</h3>
                          <p className="text-indigo-100 text-sm">
                            Next billing date is August 15, 2026
                          </p>
                        </div>
                        <div className="mt-6 md:mt-0">
                          <Button className="bg-white text-indigo-600 hover:bg-slate-50 border-none w-full md:w-auto shadow-sm">
                            Manage Subscription
                          </Button>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                        Payment Method
                      </h4>
                      <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                        <div className="h-12 w-16 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Visa ending in 4242
                          </p>
                          <p className="text-xs text-slate-500">Expires 12/28</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <Card className="border-red-200 dark:border-red-900/30 shadow-sm">
                    <CardHeader className="border-b border-red-100 dark:border-red-900/20 pb-4 bg-red-50/50 dark:bg-red-950/10">
                      <CardTitle className="text-red-600 dark:text-red-500">Danger Zone</CardTitle>
                      <p className="text-sm text-red-500/70 mt-1">
                        Irreversible and destructive actions.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/60">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                            Transfer Ownership
                          </h4>
                          <p className="text-sm text-slate-500">
                            Transfer this workspace to another user.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Transfer
                        </Button>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                            Delete Account
                          </h4>
                          <p className="text-sm text-slate-500">
                            Permanently delete your account and all of its data.
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
