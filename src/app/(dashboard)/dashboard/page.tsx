import React from 'react';
import { 
  Users, 
  Mail, 
  Target, 
  TrendingUp, 
  BarChart2, 
  Activity,
  LucideIcon 
} from 'lucide-react';

// Mock data for charts
const leadsBySource = [
  { name: 'LinkedIn', value: 45 },
  { name: 'Twitter', value: 25 },
  { name: 'Website', value: 15 },
  { name: 'Referral', value: 10 },
  { name: 'Other', value: 5 },
];

const campaignPerformance = [
  { name: 'Campaign A', opens: 85, clicks: 42, replies: 18 },
  { name: 'Campaign B', opens: 75, clicks: 35, replies: 12 },
  { name: 'Campaign C', opens: 92, clicks: 48, replies: 22 },
  { name: 'Campaign D', opens: 65, clicks: 30, replies: 8 },
];

const recentLeads = [
  { id: 1, name: 'John Smith', company: 'Acme Inc.', position: 'CTO', score: 85 },
  { id: 2, name: 'Sarah Johnson', company: 'TechCorp', position: 'VP Engineering', score: 78 },
  { id: 3, name: 'Michael Brown', company: 'Innovate LLC', position: 'Director of IT', score: 92 },
  { id: 4, name: 'Emily Davis', company: 'FutureTech', position: 'CIO', score: 81 },
  { id: 5, name: 'Robert Wilson', company: 'DataSystems', position: 'Head of Product', score: 76 },
];

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend: number;
  color: string;
}

const StatCard = ({ icon: Icon, title, value, trend, color }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            <TrendingUp size={16} className="mr-1" />
            {trend > 0 ? '+' : ''}{trend}% from last month
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-stone-500 mt-1">Welcome back! Here's an overview of your sales intelligence.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Leads" 
          value="1,248" 
          trend={12.5} 
          color="bg-blue-500"
        />
        <StatCard 
          icon={Target} 
          title="Qualified Leads" 
          value="385" 
          trend={8.2} 
          color="bg-green-500"
        />
        <StatCard 
          icon={Mail} 
          title="Active Campaigns" 
          value="12" 
          trend={-3.1} 
          color="bg-amber-500"
        />
        <StatCard 
          icon={Activity} 
          title="Engagement Rate" 
          value="24.8%" 
          trend={5.7} 
          color="bg-purple-500"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Leads by Source</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-stone-500">Chart visualization will be implemented here</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-stone-500">Chart visualization will be implemented here</p>
          </div>
        </div>
      </div>
      
      {/* Recent Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200">
          <h3 className="text-lg font-semibold">Recent Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{lead.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{lead.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.score >= 80 ? 'bg-green-100 text-green-800' : 
                        lead.score >= 60 ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">View</a>
                    <a href="#" className="text-blue-600 hover:text-blue-900">Contact</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 