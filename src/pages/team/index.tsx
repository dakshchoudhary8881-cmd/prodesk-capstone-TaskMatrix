import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from '@/components/ui/Search';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  MoreHorizontal,
  Shield,
  Activity,
  FolderKanban,
  SlidersHorizontal,
  Filter,
  Trash2,
  Edit2,
} from 'lucide-react';
import { useMemo, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useTaskStore } from '@/store/useTaskStore';
import { Modal } from '@/components/modals/Modal';
import { InviteMemberForm } from '@/components/forms/InviteMemberForm';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import toast from 'react-hot-toast';

export function Team() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editRoleUserId, setEditRoleUserId] = useState<string | null>(null);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const { users, removeUser, updateUser, fetchUsers, isLoading, error } = useUserStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchTasks();
  }, [fetchUsers, fetchProjects, fetchTasks]);

  const enhancedUsers = useMemo(
    () =>
      users.map((user, index) => ({
        ...user,
        status: index % 3 === 0 ? 'offline' : index % 4 === 0 ? 'busy' : 'online',
        phone: '+1 (555) 000-000' + index,
        location: index % 2 === 0 ? 'San Francisco, CA' : 'New York, NY',
        projectsCount: projects.filter((p) => (p.memberIds || []).includes(user.id)).length,
        tasksCount: tasks.filter((t) => t.assigneeId === user.id).length,
        joinDate: new Date(2025, index % 12, 15).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
      })),
    [users, projects, tasks]
  );

  const filteredUsers = enhancedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || user.department === filter;
    return matchesSearch && matchesFilter;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  };

  const departments = ['All', ...new Set(enhancedUsers.map((u) => u.department || 'General'))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <PageHeader
        title="Team Directory"
        description="Manage members, roles, and permissions across your organization."
        actions={
          <>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Manage Roles
            </Button>
            <Button onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-indigo-50/50 dark:bg-indigo-900/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Members
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {enhancedUsers.length}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <UsersIcon className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-emerald-50/50 dark:bg-emerald-900/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Now</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {enhancedUsers.filter((u) => u.status === 'online').length}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-purple-50/50 dark:bg-purple-900/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Departments</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {departments.length - 1}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Briefcase className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
          <div className="w-full max-w-sm">
            <Search
              placeholder="Search by name, role, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
          <Tabs>
            <TabsList className="bg-slate-50 dark:bg-slate-800/50">
              {departments.map((d) => (
                <TabsTrigger key={d} active={filter === d} onClick={() => setFilter(d || '')}>
                  {d}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Grid */}
      {error ? (
        <ErrorState
          message={error}
          onRetry={fetchUsers}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-0">
                <div className="h-16 bg-slate-100 dark:bg-slate-800" />
                <div className="px-6 pb-6 relative">
                  <Skeleton className="h-16 w-16 rounded-full border-4 border-white dark:border-slate-950 -mt-8 mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <div className="space-y-3 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 overflow-hidden"
        >
          <EmptyState
            icon={<Filter className="h-8 w-8" />}
            title="No members found"
            description="We couldn't find any team members matching your current search criteria."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilter('All');
                }}
              >
                Clear Filters
              </Button>
            }
          />
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow bg-white dark:bg-slate-950/50 overflow-hidden group">
                  {/* Card Header Background */}
                  <div className="h-16 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 relative">
                    <div className="absolute right-3 top-3">
                      <Dropdown
                        isOpen={openMenuId === user.id}
                        onClose={() => setOpenMenuId(null)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-900 backdrop-blur-sm"
                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                          >
                            <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                          </Button>
                        }
                      >
                        <DropdownItem
                          icon={<Edit2 className="h-4 w-4" />}
                          onClick={() => {
                            setOpenMenuId(null);
                            setEditRoleUserId(user.id);
                          }}
                        >
                          Edit Role
                        </DropdownItem>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                        <DropdownItem
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => {
                            setOpenMenuId(null);
                            removeUser(user.id);
                            toast.success('Member removed');
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remove Member
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>

                  <CardContent className="p-6 pt-0 relative">
                    {/* Avatar & Online Status */}
                    <div className="relative inline-block -mt-10 mb-3">
                      <Avatar
                        src={user.avatar}
                        fallback={user.name}
                        className="h-20 w-20 ring-4 ring-white dark:ring-slate-950 shadow-sm bg-slate-100 dark:bg-slate-800 text-xl"
                      />
                      <span
                        className={cn(
                          'absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-950 shadow-sm',
                          getStatusColor(user.status)
                        )}
                        title={user.status}
                      />
                    </div>

                    {/* Meta Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {user.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                        {user.role} • {user.department}
                      </p>
                      <div className="flex gap-2">
                        <Badge
                          variant={getRoleBadgeVariant(user.role || '')}
                          className="px-2.5 py-0.5 capitalize"
                        >
                          <Shield className="w-3 h-3 mr-1.5" />
                          {user.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-900 capitalize text-slate-600 dark:text-slate-300"
                        >
                          {user.department}
                        </Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-100 dark:border-slate-800/60 mb-4">
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
                        <FolderKanban className="w-5 h-5 mx-auto mb-1 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <p className="text-xs text-slate-500 font-medium">Projects</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mt-1">
                          {user.projectsCount}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center transition-colors group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
                        <Activity className="w-5 h-5 mx-auto mb-1 text-slate-400 group-hover:text-purple-500 transition-colors" />
                        <p className="text-xs text-slate-500 font-medium">Tasks</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white leading-none mt-1">
                          {user.tasksCount}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                        <span className="truncate hover:text-indigo-600 cursor-pointer transition-colors">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                        <span>{user.location}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => setProfileUserId(user.id)}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <InviteMemberForm onSuccess={() => setIsInviteModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!editRoleUserId} onClose={() => setEditRoleUserId(null)} title="Edit Role">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select a new role for {users.find((u) => u.id === editRoleUserId)?.name}.
          </p>
          <div className="grid gap-2">
            {['Admin', 'Manager', 'Member'].map((r) => (
              <Button
                key={r}
                variant="outline"
                className="justify-between w-full"
                onClick={() => {
                  if (editRoleUserId) {
                    updateUser(editRoleUserId, { role: r });
                    toast.success('Role updated');
                    setEditRoleUserId(null);
                  }
                }}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!profileUserId} onClose={() => setProfileUserId(null)} title="Member Profile">
        {(() => {
          const u = enhancedUsers.find((x) => x.id === profileUserId);
          if (!u) return null;
          return (
            <div className="text-center space-y-6 pb-2">
              <div className="relative inline-block mt-4">
                <Avatar
                  src={u.avatar}
                  fallback={u.name}
                  className="w-24 h-24 mx-auto ring-4 ring-slate-100 dark:ring-slate-800"
                />
                <span
                  className={cn(
                    'absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-950',
                    getStatusColor(u.status)
                  )}
                  title={u.status}
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{u.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {u.role} • {u.department}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </p>
                  <p
                    className="text-sm font-medium text-slate-900 dark:text-white truncate"
                    title={u.email}
                  >
                    {u.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{u.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Joined
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{u.joinDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{u.phone}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button className="flex-1" onClick={() => setProfileUserId(null)}>
                  Message
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setProfileUserId(null)}>
                  Close
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </motion.div>
  );
}

// Temporary internal Users icon mapping since lucide-react exports it
import { Users as UsersIcon } from 'lucide-react';
