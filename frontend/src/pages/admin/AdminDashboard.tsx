import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingCart, DollarSign, Activity, 
  Shield, CheckCircle, XCircle, Clock, Search
} from 'lucide-react';
import api from '../../utils/api';
import { useStore } from '../../store/useStore';
import { ActivityLog } from '../../types';

interface AdminStats {
  total_users: number;
  total_vendors: number;
  total_orders: number;
  total_revenue: number;
  pending_approvals: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/api/admin/dashboard/');
      if (res.data.success) {
        setStats(res.data.data.stats);
        setLogs(res.data.data.recent_activity);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );

  const cards = [
    { label: 'Total Revenue', value: `₹${stats?.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Users', value: stats?.total_users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Orders', value: stats?.total_orders, icon: ShoppingCart, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Pending Vendors', value: stats?.pending_approvals, icon: Shield, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Control Panel</h1>
          <p className="text-slate-500 font-medium mt-1">Global monitoring and infrastructure management.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search activity..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bg} rounded-2xl flex items-center justify-center ${card.color}`}>
                <card.icon size={24} />
              </div>
              <Activity className="text-slate-200 w-4 h-4" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Logs */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Real-time Activity Logs</h3>
            <button onClick={fetchAdminData} className="text-primary-500 font-bold text-xs hover:underline flex items-center gap-1">
              Refresh Feed
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Action</th>
                  <th className="px-8 py-4">IP Address</th>
                  <th className="px-8 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                          {log.username[0]}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{log.username}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-slate-600">{log.action}</span>
                    </td>
                    <td className="px-8 py-5">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{log.ip_address}</code>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-lg font-black mb-6">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">API Services</span>
                </div>
                <span className="text-xs font-medium text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">SMTP Gateway</span>
                </div>
                <span className="text-xs font-medium text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm font-bold">Payment Hooks</span>
                </div>
                <span className="text-xs font-medium text-yellow-500">Monitoring</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6">Maintenance</h3>
            <div className="space-y-3">
              <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all text-sm">
                Clear System Cache
              </button>
              <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all text-sm">
                Sync Product Inventory
              </button>
              <button className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all text-sm">
                Emergency Shutdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
