'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRM } from '@/components/CRM';
import { Settings } from '@/components/Settings';
import { PublicationCalendar } from '@/components/PublicationCalendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UploadButton } from "@/utils/uploadthing";
import { Image as ImageIcon, Pencil, Trash2, Share2, Calendar } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  type: 'blog' | 'news';
  status: 'draft' | 'published' | 'scheduled';
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
export function AdminDashboard() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    type: 'blog',
    status: 'draft',
    featuredImage: ''
  });

  const handleShareToLinkedIn = async (post: Post) => {
    try {
      const response = await fetch('/api/linkedin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.excerpt,
          url: `https://flyclim.com/${post.type}/${post.slug}`
        })
      });

      if (!response.ok) throw new Error('Failed to share to LinkedIn');

      toast({
        title: 'Success',
        description: 'Post shared to LinkedIn successfully'
      });
    } catch (error) {
      console.error('Failed to share to LinkedIn:', error);
      toast({
        title: 'Error',
        description: 'Failed to share to LinkedIn',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?admin=true');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create post');

      toast({
        title: 'Success',
        description: 'Post created successfully'
      });

      setFormData({
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        type: 'blog',
        status: 'draft',
        featuredImage: ''
      });

      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (title: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${title}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete post');

      toast({
        title: 'Success',
        description: 'Post deleted successfully'
      });

      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      type: post.type,
      status: post.status,
      featuredImage: post.featuredImage || ''
    });
    setActiveTab('create');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    try {
      const response = await fetch(`/api/posts/edit/${selectedPost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update post');

      toast({
        title: 'Success',
        description: 'Post updated successfully'
      });

      setSelectedPost(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        type: 'blog',
        status: 'draft',
        featuredImage: ''
      });
      setActiveTab('posts');

      fetchPosts();
    } catch (error) {
      console.error('Failed to update post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {/* <Button variant="outline" onClick={() => signOut()}>Sign Out</Button> */}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            {/* <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger> */}
            {/* <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger> */}
          </TabsList>

          <TabsContent value="posts">
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.length && posts.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={post.type === 'blog' ? 'default' : 'secondary'}
                          className={post.type === 'blog' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}
                        >
                          {post.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{post.slug}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}
                          className={post.status === 'published' ? 'bg-green-500 text-white' : post.status === 'scheduled' ?
                            'bg-blue-500 text-white' : 'bg-orange-500'}
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {post.featuredImage ? (
                          <ImageIcon className="h-4 w-4 text-green-600" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-gray-300" />
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(post.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {post.status === 'published' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareToLinkedIn(post)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(post.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="p-6">
              <form onSubmit={selectedPost ? handleUpdate : handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image</label>
                  <div className="flex items-center gap-4">
                    <Input
                      value={formData.featuredImage}
                      onChange={e => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                      placeholder="Image URL"
                    />
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setFormData(prev => ({
                            ...prev,
                            featuredImage: res[0].url
                          }));
                          toast({
                            title: 'Success',
                            description: 'Image uploaded successfully'
                          });
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          title: 'Error',
                          description: error.message,
                          variant: 'destructive'
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <Select
                      value={formData.type}
                      onValueChange={value => setFormData(prev => ({ ...prev, type: value as 'blog' | 'news' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={value => setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {selectedPost ? 'Update Post' : 'Create Post'}
                </Button>

                {selectedPost && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedPost(null);
                      setFormData({
                        title: '',
                        content: '',
                        excerpt: '',
                        slug: '',
                        type: 'blog',
                        status: 'draft',
                        featuredImage: ''
                      });
                      setActiveTab('posts');
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <PublicationCalendar />
          </TabsContent>

          <TabsContent value="crm">
            <CRM />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}