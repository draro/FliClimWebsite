'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings as SettingsIcon,
  FileText,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) {
    return children;
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin'
    },
    {
      name: 'Posts',
      href: '/admin/posts',
      icon: FileText,
      current: pathname === '/admin/posts'
    },
    {
      name: 'Calendar',
      href: '/admin/calendar',
      icon: Calendar,
      current: pathname === '/admin/calendar'
    },
    {
      name: 'CRM',
      href: '/admin/crm',
      icon: Users,
      current: pathname === '/admin/crm'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: SettingsIcon,
      current: pathname === '/admin/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                FlyClim
              </Link>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${item.current
                      ? 'bg-gray-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}
                    `}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {session.user?.email}
                </p>
                <Button
                  variant="ghost"
                  className="mt-1 text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}