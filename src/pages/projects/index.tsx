import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from '@/components/ui/Search';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { LayoutGrid, List as ListIcon, Filter, Plus, ArrowUpDown, Star } from 'lucide-react';
import { useProjectStore } from '@/store/useProjectStore';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { PageHeader } from '@/components/layout/PageHeader';
import { Modal } from '@/components/modals/Modal';
import { CreateProjectForm } from '@/components/forms/CreateProjectForm';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export function Projects() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { projects, isLoading, fetchProjects, error } = useProjectStore();
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchProjects(currentWorkspace.id);
    }
  }, [fetchProjects, currentWorkspace?.id]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === 'All'
          ? project.status !== 'archived'
          : filter === 'Favorites'
            ? project.isFavorite && project.status !== 'archived'
            : filter === 'archived'
              ? project.status === 'archived'
              : project.status === filter && project.status !== 'archived';
      return matchesSearch && matchesFilter;
    });

    result = result.sort((a, b) => {
      const dateA = new Date(a.dueDate || 0).getTime();
      const dateB = new Date(b.dueDate || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [projects, searchQuery, filter, sortOrder]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Projects"
        description="Manage and track your team's ongoing initiatives."
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        }
      />

      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto flex-1">
          <div className="w-full sm:max-w-sm">
            <Search
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" className="shrink-0 hidden sm:flex">
              <Filter className="h-4 w-4 text-slate-500" />
            </Button>
            <Button
              variant="outline"
              className="shrink-0 w-full sm:w-auto text-slate-600 dark:text-slate-300"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end overflow-x-auto pb-2 xl:pb-0 scrollbar-none">
          <Tabs>
            <TabsList className="bg-slate-50 dark:bg-slate-800/50 flex flex-nowrap min-w-max">
              {[
                { key: 'All', label: 'All' },
                { key: 'Favorites', label: 'Favorites' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' },
                { key: 'planning', label: 'Planning' },
                { key: 'on-hold', label: 'On Hold' },
                { key: 'archived', label: 'Archived' },
              ].map((f) => (
                <TabsTrigger key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                  {f.key === 'Favorites' && <Star className="h-3 w-3 mr-1 fill-current" />}
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="hidden sm:flex items-center rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-950 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState
          message={error}
          onRetry={fetchProjects}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
        />
      ) : isLoading ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-6 h-[220px]">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-2 w-full mb-8" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 overflow-hidden"
        >
          <EmptyState
            icon={<Filter className="h-8 w-8" />}
            title="No projects found"
            description="We couldn't find any projects matching your current search criteria and filters."
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
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} viewMode={viewMode} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <CreateProjectForm onSuccess={() => setIsCreateModalOpen(false)} />
      </Modal>
    </motion.div>
  );
}
