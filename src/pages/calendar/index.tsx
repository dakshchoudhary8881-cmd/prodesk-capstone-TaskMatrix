import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckSquare,
  Plus,
  AlertCircle,
  ListTodo,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { PageHeader } from '@/components/layout/PageHeader';
import { useEventStore } from '@/store/useEventStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useUserStore } from '@/store/useUserStore';
import { Modal } from '@/components/modals/Modal';
import { CreateEventForm } from '@/components/forms/CreateEventForm';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Search } from '@/components/ui/Search';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import type { CalendarEvent } from '@/store/useEventStore';
import { Edit2, Trash2, MoreHorizontal, Check, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 8)); // Aug 2026 based on mock data
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 7, 8));
  const [view, setView] = useState<'month' | 'week'>('month');

  const { daysInMonth, startDayIndex } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      daysInMonth: lastDay.getDate(),
      startDayIndex: firstDay.getDay(),
    };
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Helper to check if an event is on a given day
  const isEventOnDay = (eventStart: string, day: number, month: number, year: number) => {
    const d = new Date(eventStart);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const {
    events,
    deleteEvent,
    fetchEvents,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useEventStore();
  const { tasks, fetchTasks, isLoading: isTasksLoading } = useTaskStore();
  const { users, fetchUsers, isLoading: isUsersLoading } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchTasks();
    fetchUsers();
  }, [fetchEvents, fetchTasks, fetchUsers]);

  const isLoading = isEventsLoading || isTasksLoading || isUsersLoading;
  const error = eventsError;

  // Derived Data
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'all' || e.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const selectedDayEvents = filteredEvents.filter((e) =>
    isSameDay(new Date(e.start), selectedDate)
  );

  const todayTasks = tasks.filter(
    (t) => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate) && t.status !== 'done'
  );

  const upcomingDeadlines = tasks
    .filter((t) => t.dueDate && new Date(t.dueDate) >= selectedDate && t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'planning':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/50';
      case 'review':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
      case 'milestone':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'planning':
        return 'bg-purple-500';
      case 'review':
        return 'bg-orange-500';
      case 'milestone':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col space-y-6"
    >
      <PageHeader
        title="Calendar & Schedule"
        description="Manage your meetings, deadlines, and project milestones."
        actions={
          <>
            <div className="flex flex-col sm:flex-row items-center gap-2 mr-2 w-full sm:w-auto">
              <div className="w-full sm:w-48">
                <Search
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Dropdown
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-slate-600 dark:text-slate-300 h-9 w-full sm:w-auto"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  }
                >
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Event Type
                  </div>
                  {['all', 'meeting', 'planning', 'review', 'milestone'].map((type) => (
                    <DropdownItem
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setIsFilterOpen(false);
                      }}
                      className="flex justify-between"
                    >
                      <span className="capitalize">{type}</span>
                      {filterType === type && <Check className="h-4 w-4 text-indigo-500" />}
                    </DropdownItem>
                  ))}
                </Dropdown>

                <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-8 px-4 rounded-md',
                      view === 'month' ? 'bg-white dark:bg-slate-800 shadow-sm' : ''
                    )}
                    onClick={() => setView('month')}
                  >
                    Month
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-8 px-4 rounded-md',
                      view === 'week' ? 'bg-white dark:bg-slate-800 shadow-sm' : ''
                    )}
                    onClick={() => setView('week')}
                  >
                    Week
                  </Button>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEventToEdit(null);
                setIsCreateModalOpen(true);
              }}
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            fetchEvents();
            fetchTasks();
            fetchUsers();
          }}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
        />
      ) : isLoading ? (
        <div className="flex-1 flex gap-6 min-h-0">
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
          <div className="w-96 hidden xl:flex flex-col gap-6">
            <Skeleton className="h-1/2 w-full rounded-2xl" />
            <Skeleton className="h-1/2 w-full rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Left Column: Calendar Grid */}
          <Card className="xl:col-span-2 overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-indigo-500" />
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/80 dark:bg-slate-900/40">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/60 last:border-0"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 auto-rows-[120px] bg-slate-100 dark:bg-slate-800/60 gap-px">
                {Array.from({ length: startDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white/50 dark:bg-slate-950/50 p-2" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = isSameDay(
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
                    selectedDate
                  );
                  const isToday = isSameDay(
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
                    new Date()
                  );

                  const dayEvents = filteredEvents.filter((e) =>
                    isEventOnDay(e.start, day, currentDate.getMonth(), currentDate.getFullYear())
                  );
                  const dayTasks = tasks.filter(
                    (t) =>
                      t.dueDate &&
                      isEventOnDay(
                        t.dueDate,
                        day,
                        currentDate.getMonth(),
                        currentDate.getFullYear()
                      ) &&
                      t.status !== 'done'
                  );

                  return (
                    <div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        'bg-white dark:bg-slate-950 p-2 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/80 relative overflow-hidden group',
                        isSelected &&
                          'ring-2 ring-indigo-500 ring-inset bg-indigo-50/30 dark:bg-indigo-900/10 z-10'
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                            isToday
                              ? 'bg-indigo-600 text-white shadow-md'
                              : isSelected
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400'
                                : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          )}
                        >
                          {day}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 mt-2.5 mr-1" />
                        )}
                      </div>

                      <div className="mt-2 space-y-1 overflow-y-auto max-h-[70px] kanban-scrollbar pr-1">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              'text-[10px] px-1.5 py-1 rounded truncate border font-medium hover:opacity-80 transition-opacity',
                              getEventTypeColor(event.type)
                            )}
                            title={event.title}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEventToEdit(event);
                              setIsCreateModalOpen(true);
                            }}
                          >
                            {new Date(event.start).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Fill remaining days to complete the grid */}
                {Array.from({ length: 42 - (startDayIndex + daysInMonth) }).map((_, i) => (
                  <div key={`empty-end-${i}`} className="bg-white/50 dark:bg-slate-950/50 p-2" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Agenda & Tasks */}
          <div className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4 bg-slate-50/50 dark:bg-slate-900/20 sticky top-0 z-10">
                <CardTitle className="flex justify-between items-center text-lg">
                  <span>
                    Agenda for{' '}
                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {selectedDayEvents.length} Events
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto kanban-scrollbar flex-1 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDate.toISOString()}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 space-y-5"
                  >
                    {selectedDayEvents.length === 0 ? (
                      <div className="text-center py-10 flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-3">
                          <CalendarIcon className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">No events scheduled</p>
                        <p className="text-xs text-slate-400 mt-1">Enjoy your free time!</p>
                      </div>
                    ) : (
                      selectedDayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="relative pl-6 pb-5 last:pb-0 before:absolute before:left-[7px] before:top-2 before:bottom-[-16px] before:w-px before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden"
                        >
                          <span
                            className={cn(
                              'absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white dark:border-slate-950',
                              getEventTypeBadge(event.type)
                            )}
                          />
                          <div
                            className={cn(
                              'p-4 rounded-xl border transition-shadow hover:shadow-md',
                              getEventTypeColor(event.type)
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{event.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-white/50 dark:bg-slate-950/50 text-xs border-current opacity-80"
                                >
                                  {event.type}
                                </Badge>
                                <Dropdown
                                  isOpen={openMenuId === event.id}
                                  onClose={() => setOpenMenuId(null)}
                                  trigger={
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                                      onClick={() =>
                                        setOpenMenuId(openMenuId === event.id ? null : event.id)
                                      }
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  }
                                >
                                  <DropdownItem
                                    icon={<Edit2 className="h-4 w-4" />}
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setEventToEdit(event);
                                      setIsCreateModalOpen(true);
                                    }}
                                  >
                                    Edit Event
                                  </DropdownItem>
                                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                  <DropdownItem
                                    icon={<Trash2 className="h-4 w-4" />}
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      deleteEvent(event.id);
                                      toast.success('Event deleted');
                                    }}
                                    className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    Delete Event
                                  </DropdownItem>
                                </Dropdown>
                              </div>
                            </div>
                            <p className="text-sm opacity-90 mb-3">{event.description}</p>
                            <div className="flex items-center gap-4 text-xs font-medium opacity-80 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />{' '}
                                {new Date(event.start).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}{' '}
                                -{' '}
                                {new Date(event.end).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {event.type === 'meeting' && (
                                <span className="flex items-center gap-1">
                                  <Video className="h-3.5 w-3.5" /> Google Meet
                                </span>
                              )}
                            </div>
                            {event.attendees && (
                              <div className="flex -space-x-2">
                                {event.attendees.map((id) => {
                                  const user = users.find((u) => u.id === id);
                                  return (
                                    <Avatar
                                      key={id}
                                      src={user?.avatar}
                                      fallback={user?.name || '?'}
                                      size="sm"
                                      className="ring-2 ring-white/50 dark:ring-slate-900/50"
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-indigo-500" /> Due Today
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {todayTasks.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No tasks due today</p>
                ) : (
                  <div className="space-y-3">
                    {todayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group cursor-pointer hover:border-indigo-300 transition-colors"
                      >
                        <CheckSquare className="h-4 w-4 text-slate-400 mt-0.5 group-hover:text-indigo-500 transition-colors" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due{' '}
                            {new Date(task.dueDate!).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" /> Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No upcoming deadlines</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingDeadlines.map((task) => (
                      <div
                        key={task.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex-1 pr-4 truncate">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {task.title}
                          </p>
                          <p className="text-xs font-medium text-red-500 mt-1">
                            {new Date(task.dueDate!).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-white dark:bg-slate-950 shrink-0">
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={eventToEdit ? 'Edit Event' : 'Create New Event'}
      >
        <CreateEventForm
          onSuccess={() => setIsCreateModalOpen(false)}
          initialData={eventToEdit || undefined}
        />
      </Modal>
    </motion.div>
  );
}
