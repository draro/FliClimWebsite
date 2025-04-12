'use client';

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, Plus, Share2, ListTodo } from 'lucide-react';
import { TaskList } from '@/components/TaskList';
import type { TaskStatus } from '@/app/api/tasks/route';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

interface ScheduledPost {
  _id: string;
  title: string;
  content: string;
  type: 'blog' | 'news';
  scheduledFor: string;
  shareToLinkedIn: boolean;
  status: 'scheduled' | 'published';
}

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
}

interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: 'needsAction' | 'completed';
  listTitle?: string;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  in_progress: '#3B82F6', // blue
  scheduled: '#8B5CF6', // purple
  meeting_done: '#10B981', // green
  not_answered: '#EF4444', // red
  done: '#059669', // emerald
  to_follow_up: '#F59E0B' // amber
};

export function PublicationCalendar() {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [googleTasks, setGoogleTasks] = useState<GoogleTask[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    content: '',
    type: 'blog',
    scheduledFor: new Date().toISOString().split('T')[0],
    generateContent: true,
    shareToLinkedIn: false,
    publishNow: false
  });

  useEffect(() => {
    fetchSchedule();
    fetchTasks();
    fetchGoogleTasks();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/schedule');
      const data = await response.json();

      const postEvents = data.map((post: ScheduledPost) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        start: new Date(post.scheduledFor),
        end: new Date(post.scheduledFor),
        type: post.type,
        shareToLinkedIn: post.shareToLinkedIn,
        status: post.status,
        eventType: 'post'
      }));

      setEvents(prev => [...prev, ...postEvents]);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch publication schedule',
        variant: 'destructive'
      });
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();

      const taskEvents = data.tasks.map((task: Task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        status: task.status,
        priority: task.priority,
        eventType: 'task'
      }));

      setEvents(prev => [...prev, ...taskEvents]);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive'
      });
    }
  };

  const fetchGoogleTasks = async () => {
    try {
      const response = await fetch('/api/calendar/tasks');
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: 'Google Calendar Not Connected',
            description: 'Please connect Google Calendar in Settings',
            variant: 'destructive'
          });
          return;
        }
        throw new Error('Failed to fetch Google tasks');
      }
      const data = await response.json();

      // Convert Google tasks to calendar events
      const taskEvents = data.tasks
        .filter((task: GoogleTask) => task.due) // Only include tasks with due dates
        .map((task: GoogleTask) => ({
          id: task.id,
          title: `[${task.listTitle}] ${task.title}`,
          start: new Date(task.due!),
          end: new Date(task.due!),
          status: task.status,
          description: task.notes,
          eventType: 'google_task'
        }));

      setEvents(prev => [...prev, ...taskEvents]);
    } catch (error) {
      console.error('Failed to fetch Google tasks:', error);
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to schedule post');

      toast({
        title: 'Success',
        description: formData.publishNow
          ? 'Post published successfully'
          : 'Post scheduled successfully'
      });

      setShowAddDialog(false);
      setFormData({
        title: '',
        topic: '',
        content: '',
        type: 'blog',
        scheduledFor: new Date().toISOString().split('T')[0],
        generateContent: true,
        shareToLinkedIn: false,
        publishNow: false
      });

      // Refresh events
      setEvents([]);
      fetchSchedule();
      fetchTasks();
    } catch (error) {
      console.error('Failed to schedule post:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule post',
        variant: 'destructive'
      });
    }
  };

  const eventStyleGetter = (event: any) => {
    if (event.eventType === 'post') {
      return {
        style: {
          backgroundColor: event.type === 'blog' ? '#2563eb' : '#10b981',
          borderLeft: event.shareToLinkedIn ? '4px solid #8b5cf6' : 'none'
        }
      };
    } else if (event.eventType === 'task') {
      return {
        style: {
          backgroundColor: STATUS_COLORS[event.status as TaskStatus] ?? '#6b7280',
          borderLeft: `4px solid ${event.priority === 'high' ? '#ef4444' :
            event.priority === 'medium' ? '#f59e0b' :
              '#10b981'
            }`
        }
      };
    } else if (event.eventType === 'google_task') {
      return {
        style: {
          backgroundColor: event.status === 'completed' ? '#059669' : '#6366f1',
          borderLeft: '4px solid #818cf8'
        }
      };
    }

    // ✅ Default fallback (to avoid `undefined`)
    return {
      style: {
        backgroundColor: '#6b7280'
      }
    };
  };
  return (
    <div className="min-h-[800px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Publication Calendar</h2>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule New Post</DialogTitle>
                <DialogDescription>
                  Schedule a post and optionally generate content with AI
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Existing form fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <Select
                      value={formData.type}
                      onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="news">News Article</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Schedule Date</label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData.scheduledFor}
                        onChange={e => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                        required
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    required={!formData.generateContent}
                    disabled={formData.generateContent}
                  />
                </div>

                {formData.generateContent ? (
                  <div>
                    <label className="block text-sm font-medium mb-1">Topic</label>
                    <Input
                      value={formData.topic}
                      onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="Enter the topic to write about"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter post content"
                      required
                      rows={10}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generateContent"
                      checked={formData.generateContent}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, generateContent: checked as boolean }))
                      }
                    />
                    <label htmlFor="generateContent" className="text-sm font-medium">
                      Generate content with AI
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shareToLinkedIn"
                      checked={formData.shareToLinkedIn}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, shareToLinkedIn: checked as boolean }))
                      }
                    />
                    <label htmlFor="shareToLinkedIn" className="text-sm font-medium">
                      Share to LinkedIn
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="publishNow"
                      checked={formData.publishNow}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, publishNow: checked as boolean }))
                      }
                    />
                    <label htmlFor="publishNow" className="text-sm font-medium">
                      Publish immediately
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {formData.publishNow ? 'Publish Now' : 'Schedule Post'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ListTodo className="h-4 w-4 mr-2" />
                View Tasks
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tasks</DialogTitle>
                <DialogDescription>
                  View and manage tasks
                </DialogDescription>
              </DialogHeader>
              <TaskList showInCalendar />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedEvent?.eventType === 'post' ? (
              <>
                <div>
                  <h4 className="font-medium mb-1">Type</h4>
                  <p className="text-sm">{selectedEvent?.type}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Scheduled For</h4>
                  <p className="text-sm">
                    {selectedEvent?.start && format(selectedEvent.start, 'PPP')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  <p className="text-sm capitalize">{selectedEvent?.status}</p>
                </div>
                {selectedEvent?.shareToLinkedIn && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm">Will be shared to LinkedIn</span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-1">Content Preview</h4>
                  <p className="text-sm line-clamp-4">{selectedEvent?.content}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-medium mb-1">Description</h4>
                  <p className="text-sm">{selectedEvent?.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Due Date</h4>
                  <p className="text-sm">
                    {selectedEvent?.start && format(selectedEvent.start, 'PPP p')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Priority</h4>
                  <p className="text-sm capitalize">{selectedEvent?.priority}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Status</h4>
                  <p className="text-sm capitalize">{selectedEvent?.status}</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card className="flex-1 p-6">
        <div className="h-[700px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleEventClick}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </Card>
    </div>
  );
}