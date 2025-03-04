import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Target,
  Mail,
  Search,
  Database,
  Brain,
  BarChart,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Target, label: 'ICP Builder', href: '/icps' },
    { icon: Users, label: 'Leads', href: '/leads' },
    { icon: Mail, label: 'Campaigns', href: '/campaigns' },
    { icon: Search, label: 'Scraping', href: '/scraping' },
    { icon: Database, label: 'Enrichment', href: '/enrichment' },
    { icon: Brain, label: 'AI Insights', href: '/insights' },
    { icon: BarChart, label: 'Analytics', href: '/analytics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="h-full w-64 bg-stone-900 text-white p-4 flex flex-col">
      <div className="mb-8 px-4 py-3">
        <h1 className="text-xl font-bold">Lead Research AI</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-stone-800 transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-stone-700">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-stone-800 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="h-16 border-b border-stone-200 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          <span className="font-medium">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-stone-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 