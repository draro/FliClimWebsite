'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Clock, Plus, Trash2 } from 'lucide-react';
import type { TaskStatus } from '@/app/api/tasks/route';

interface Task {
  _id: string;
  leadId?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
}

interface TaskListProps {
  leadId?: string;
  showInCalendar?: boolean;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  scheduled: 'bg-purple-100 text-purple-800 border-purple-200',
  meeting_done: 'bg-green-100 text-green-800 border-green-200',
  not_answered: 'bg-red-100 text-red-800 border-red-200',
  done: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  to_follow_up: 'bg-amber-100 text-amber-800 border-amber-200'
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  scheduled: 'Scheduled',
  meeting_done: 'Meeting Done',
  not_answered: 'Not Answered',
  done: 'Done',
  to_follow_up: 'To Follow Up'
};

export function TaskList({ leadId, showInCalendar }: TaskListProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchTasks();
  }, [leadId]);

  const fetchTasks = async () => {
    try {
      const url = new URL('/api/tasks', window.location.origin);
      if (leadId) url.searchParams.append('leadId', leadId);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          leadId
        })
      });

      if (!response.ok) throw new Error('Failed to create task');

      toast({
        title: 'Success',
        description: 'Task created successfully'
      });

      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
      });
      setShowAddDialog(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          status: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update task');

      toast({
        title: 'Success',
        description: 'Task status updated successfully'
      });

      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (task: Task) => {
    setSelectedTask(task);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedTask) return;

    try {
      const response = await fetch(`/api/tasks/${selectedTask._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete task');

      toast({
        title: 'Success',
        description: 'Task deleted successfully'
      });

      setShowDeleteDialog(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task and set its priority and due date.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={value => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {tasks.map(task => (
          <Card key={task._id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleStatusChange(task._id, value as TaskStatus)}
                  >
                    <SelectTrigger className={`w-[160px] ${STATUS_COLORS[task.status]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="ml-4"
                onClick={() => handleDelete(task)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Click "Add Task" to create one.
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}