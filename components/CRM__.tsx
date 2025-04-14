'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { UserPlus, Mail, Phone, Linkedin, MessageSquarePlus, Pencil, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskList } from '@/components/TaskList';
import { Checkbox } from '@/components/ui/checkbox';

interface Lead {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  linkedinProfile?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  source: 'website' | 'demo' | 'manual';
  activities: Array<{
    type: string;
    note: string;
    timestamp: string;
    eventId?: string;
  }>;
  createdAt: string;
}

export function CRM() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    createMeet: false
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    linkedinProfile: '',
    status: 'new',
    source: 'manual'
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data.leads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leads',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/leads', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...formData, _id: selectedLead?._id } : formData)
      });

      if (!response.ok) throw new Error(isEditing ? 'Failed to update lead' : 'Failed to create lead');

      toast({
        title: 'Success',
        description: isEditing ? 'Lead updated successfully' : 'Lead created successfully'
      });

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        linkedinProfile: '',
        status: 'new',
        source: 'manual'
      });
      setShowAddForm(false);
      setIsEditing(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      console.error(isEditing ? 'Failed to update lead:' : 'Failed to create lead:', error);
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update lead' : 'Failed to create lead',
        variant: 'destructive'
      });
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;

    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: selectedLead._id,
          note: newNote
        })
      });

      if (!response.ok) throw new Error('Failed to add note');

      toast({
        title: 'Success',
        description: 'Note added successfully'
      });

      setNewNote('');
      fetchLeads();
    } catch (error) {
      console.error('Failed to add note:', error);
      toast({
        title: 'Error',
        description: 'Failed to add note',
        variant: 'destructive'
      });
    }
  };

  const handleCreateEvent = async () => {
    if (!selectedLead) return;

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead._id,
          ...calendarEvent
        })
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === 'Google Calendar not connected') {
          toast({
            title: 'Error',
            description: 'Please connect Google Calendar in Settings first',
            variant: 'destructive'
          });
          return;
        }
        throw new Error('Failed to create event');
      }

      const data = await response.json();

      toast({
        title: 'Success',
        description: 'Calendar event created successfully'
      });

      setCalendarEvent({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        createMeet: false
      });
      setShowCalendarDialog(false);
      fetchLeads();
    } catch (error) {
      console.error('Failed to create event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create calendar event',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      phone: lead.phone || '',
      linkedinProfile: lead.linkedinProfile || '',
      status: lead.status,
      source: lead.source
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: leadId,
          status: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update lead status');

      toast({
        title: 'Success',
        description: 'Lead status updated successfully'
      });

      fetchLeads();
    } catch (error) {
      console.error('Failed to update lead status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-purple-100 text-purple-800 border-purple-200',
      qualified: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      proposal: 'bg-amber-100 text-amber-800 border-amber-200',
      won: 'bg-green-100 text-green-800 border-green-200',
      lost: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      website: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      demo: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      manual: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[source] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lead Management</h2>
        <Button onClick={() => {
          setIsEditing(false);
          setSelectedLead(null);
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            linkedinProfile: '',
            status: 'new',
            source: 'manual'
          });
          setShowAddForm(!showAddForm);
        }}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <Input
                  value={formData.company}
                  onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
              <Input
                value={formData.linkedinProfile}
                onChange={e => setFormData(prev => ({ ...prev, linkedinProfile: e.target.value }))}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={value => setFormData(prev => ({ ...prev, status: value as Lead['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <Select
                  value={formData.source}
                  onValueChange={value => setFormData(prev => ({ ...prev, source: value as Lead['source'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                    <SelectItem value="website">Website Form</SelectItem>
                    <SelectItem value="demo">Demo Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setShowAddForm(false);
                setIsEditing(false);
                setSelectedLead(null);
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Lead' : 'Add Lead'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.company}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{lead.phone}</span>
                      </div>
                    )}
                    {lead.linkedinProfile && (
                      <div className="flex items-center gap-1">
                        <Linkedin className="h-4 w-4" />
                        <a
                          href={lead.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Profile
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.status}
                    onValueChange={(value) => handleStatusChange(lead._id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                    {lead.source}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(lead)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowActivityDialog(true);
                      }}
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowCalendarDialog(true);
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Lead Activities - {selectedLead?.name}</DialogTitle>
            <DialogDescription>
              View activities, add notes, and manage tasks
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-8 flex-1 overflow-hidden">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1"
                />
                <Button onClick={handleAddNote}>Add Note</Button>
              </div>

              <ScrollArea className="h-[400px] rounded-md border p-4">
                {selectedLead?.activities?.map((activity, index) => (
                  <div
                    key={index}
                    className="mb-4 pb-4 border-b last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">
                        {activity.note}
                      </p>
                      <span className="text-xs text-gray-500">
                        {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {activity.type}
                    </p>
                    {activity.eventId && (
                      <a
                        href={`https://calendar.google.com/calendar/event?eid=${activity.eventId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                      >
                        View in Calendar
                      </a>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="border-l pl-8">
              <TaskList leadId={selectedLead?._id} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting - {selectedLead?.name}</DialogTitle>
            <DialogDescription>
              Create a calendar event for this lead
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <Input
                value={calendarEvent.title}
                onChange={e => setCalendarEvent(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={calendarEvent.description}
                onChange={e => setCalendarEvent(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <Input
                  type="datetime-local"
                  value={calendarEvent.startTime}
                  onChange={e => setCalendarEvent(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <Input
                  type="datetime-local"
                  value={calendarEvent.endTime}
                  onChange={e => setCalendarEvent(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="createMeet"
                checked={calendarEvent.createMeet}
                onCheckedChange={(checked) =>
                  setCalendarEvent(prev => ({ ...prev, createMeet: checked as boolean }))
                }
              />
              <label
                htmlFor="createMeet"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Create Google Meet link
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" onClick={handleCreateEvent}>
                Create Event
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}