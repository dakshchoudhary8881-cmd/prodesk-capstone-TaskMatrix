import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Edit2, Archive, Trash2, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge, type BadgeProps } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Modal } from '@/components/modals/Modal';
import { CreateProjectForm } from '@/components/forms/CreateProjectForm';
import { useProjectStore } from '@/store/useProjectStore';
import { useUserStore } from '@/store/useUserStore';
import type { Project } from '@/types';
import toast from 'react-hot-toast';

interface ProjectCardProps {
  project: Project;
  viewMode: 'grid' | 'list';
}

export function ProjectCard({ project, viewMode }: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateProject, deleteProject } = useProjectStore();

  const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'default';
      case 'Planning':
        return 'secondary';
      case 'On Hold':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const { users } = useUserStore();

  const teamMembers = (project.memberIds || []).map((id) => users.find((u) => u.id === id)).filter(Boolean);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateProject(project.id, { isFavorite: !project.isFavorite });
    toast.success(project.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const toggleArchive = () => {
    setIsMenuOpen(false);
    updateProject(project.id, { isArchived: !project.isArchived });
    toast.success(project.isArchived ? 'Project unarchived' : 'Project archived');
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    deleteProject(project.id);
    toast.success('Project deleted');
  };

  const handleCardClick = () => {
    // In a real app this would navigate to the project details /board?projectId=...
    toast.success(`Navigating to ${project.name} details...`);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className="cursor-pointer h-full"
      >
        <Card
          className={`h-full transition-shadow hover:shadow-lg dark:hover:shadow-indigo-500/10 border-slate-200 dark:border-slate-800 ${project.isArchived ? 'opacity-70' : ''}`}
        >
          <CardContent
            className={`p-6 ${viewMode === 'list' ? 'flex flex-col md:flex-row md:items-center justify-between gap-6' : 'flex flex-col h-full'}`}
          >
            <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'flex-1'}>
              <div className="flex items-start justify-between mb-4">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                      {project.name}
                    </h3>
                    <button
                      onClick={toggleFavorite}
                      className="text-slate-400 hover:text-yellow-500 transition-colors focus:outline-none"
                    >
                      {project.isFavorite ? (
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                    {project.isArchived && (
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 ml-1">
                        Archived
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {viewMode === 'grid' && (
                    <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                  )}
                  <Dropdown
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    trigger={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(!isMenuOpen);
                        }}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors focus:outline-none"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    }
                  >
                    <DropdownItem
                      icon={<Edit2 />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit Project
                    </DropdownItem>
                    <DropdownItem
                      icon={<Archive />}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive();
                      }}
                    >
                      {project.isArchived ? 'Unarchive' : 'Archive'}
                    </DropdownItem>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <DropdownItem
                      icon={<Trash2 />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>

            <div className={`${viewMode === 'list' ? 'w-full md:w-48 shrink-0' : 'mb-6'}`}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Progress
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {project.progress}%
                </span>
              </div>
              <ProgressBar
                value={project.progress}
                indicatorClassName={project.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}
              />
            </div>

            <div
              className={`flex items-center justify-between ${
                viewMode === 'list'
                  ? 'w-full md:w-auto shrink-0 flex-row md:justify-end gap-6'
                  : 'pt-4 border-t border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1.5 shrink-0">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : 'No Due Date'}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {viewMode === 'list' && (
                  <Badge
                    variant={getStatusBadgeVariant(project.status)}
                    className="hidden md:inline-flex"
                  >
                    {project.status}
                  </Badge>
                )}
                <div className="flex -space-x-2">
                  {teamMembers.slice(0, 3).map((member, i) => (
                    <Avatar
                      key={i}
                      fallback={member?.name || 'U'}
                      src={member?.avatar}
                      size="sm"
                      className="ring-2 ring-white dark:ring-slate-900"
                    />
                  ))}
                  {teamMembers.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                      +{teamMembers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        <CreateProjectForm onSuccess={() => setIsEditModalOpen(false)} initialData={project} />
      </Modal>
    </>
  );
}
