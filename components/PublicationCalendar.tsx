'use client';

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
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
import { Calendar as CalendarIcon, Plus, Share2 } from 'lucide-react';

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

export function PublicationCalendar() {
    const { toast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEventDialog, setShowEventDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
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
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await fetch('/api/schedule');
            const data = await response.json();

            setEvents(data.map((post: ScheduledPost) => ({
                id: post._id,
                title: post.title,
                content: post.content,
                start: new Date(post.scheduledFor),
                end: new Date(post.scheduledFor),
                type: post.type,
                shareToLinkedIn: post.shareToLinkedIn,
                status: post.status
            })));
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch publication schedule',
                variant: 'destructive'
            });
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
            fetchSchedule();
        } catch (error) {
            console.error('Failed to schedule post:', error);
            toast({
                title: 'Error',
                description: 'Failed to schedule post',
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Publication Calendar</h2>
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
            </div>

            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
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
                    </div>
                </DialogContent>
            </Dialog>

            <Card className="p-6">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={handleEventClick}
                    eventPropGetter={(event) => ({
                        className: `bg-${event.type === 'blog' ? 'blue' : 'green'}-600 ${event.shareToLinkedIn ? 'border-l-4 border-purple-500' : ''
                            } cursor-pointer`
                    })}
                />
            </Card>
        </div>
    );
}