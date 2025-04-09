'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { Users, FileText, Eye, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalLeads: number;
  totalPosts: number;
  totalViews: number;
  conversionRate: number;
  leadsByDay: Array<{ date: string; count: number }>;
  postsByType: Array<{ type: string; count: number }>;
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalPosts: 0,
    totalViews: 0,
    conversionRate: 0,
    leadsByDay: [],
    postsByType: []
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch leads
        const leadsRes = await fetch('/api/leads');
        const leadsData = await leadsRes.json();

        // Fetch posts
        const postsRes = await fetch('/api/posts?admin=true');
        const postsData = await postsRes.json();

        // Calculate stats
        const totalLeads = leadsData.leads.length;
        const totalPosts = postsData.total;
        const totalViews = Math.floor(Math.random() * 10000); // Mock data
        const conversionRate = (totalLeads / totalViews) * 100;

        // Group leads by day
        const leadsByDay = leadsData.leads.reduce((acc: any[], lead: any) => {
          const date = format(new Date(lead.createdAt), 'MMM d');
          const existing = acc.find(item => item.date === date);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ date, count: 1 });
          }
          return acc;
        }, []);

        // Group posts by type
        const postsByType = [
          { type: 'Blog', count: postsData.posts.filter((p: any) => p.type === 'blog').length },
          { type: 'News', count: postsData.posts.filter((p: any) => p.type === 'news').length }
        ];

        setStats({
          totalLeads,
          totalPosts,
          totalViews,
          conversionRate,
          leadsByDay,
          postsByType
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalLeads}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPosts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leads Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.leadsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Posts by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.postsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stats.postsByType.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}