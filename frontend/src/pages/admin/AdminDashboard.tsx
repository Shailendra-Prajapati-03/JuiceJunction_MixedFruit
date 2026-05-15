import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, ShoppingCart, DollarSign, Activity, 
  Shield, CheckCircle, XCircle, Clock, Search,
  Filter, LayoutDashboard, Database, Key, Eye, RefreshCw
} from 'lucide-react';
import api from '../../utils/api';
import { useStore } from '../../store/useStore';
import { AdminDashboardData, ActivityLog, LoginHistory } from '../../types';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'security'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/dashboard/');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-t-2 border-primary-500 rounded-full"
      />
    </div>
  );

  const stats = data?.stats;
  const logs = data?.recent_activity || [];
  const logins = data?.recent_logins || [];

  const cards = [
    { label: 'Total Revenue', value: `₹${stats?.total_revenue.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Users', value: stats?.total_users || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Global Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Pending Approvals', value: stats?.pending_approvals || 0, icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogins = logins.filter(login => 
    login.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    login.device.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 selection:bg-primary-500/30">
      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/10 blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-500">Node Cluster: Alpha</span>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Nexus Terminal</h1>
          <p className="text-slate-400 font-medium">Enterprise core monitoring & security orchestration.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search cluster..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-primary-500 w-64 md:w-80 backdrop-blur-xl transition-all shadow-2xl"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAdminData}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 px-4">Management Modules</p>
            <nav className="space-y-2">
              <NavItem 
                icon={LayoutDashboard} 
                label="Overview" 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')} 
              />
              <NavItem 
                icon={Activity} 
                label="Activity Audit" 
                active={activeTab === 'activity'} 
                onClick={() => setActiveTab('activity')} 
              />
              <NavItem 
                icon={Shield} 
                label="Security Ops" 
                active={activeTab === 'security'} 
                onClick={() => setActiveTab('security')} 
              />
              <NavItem 
                icon={Database} 
                label="Data Infrastructure" 
                disabled 
              />
            </nav>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-violet-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-xl font-black mb-2 relative z-10">Nexus v4.0</h4>
            <p className="text-white/70 text-sm mb-6 relative z-10 font-medium">All systems operational. Network latency 24ms.</p>
            <button className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors relative z-10">
              View Logs
            </button>
          </div>
        </div>

        {/* Dynamic Work Area */}
        <div className="lg:col-span-9 space-y-8">
          
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl relative group hover:bg-white/10 transition-all cursor-default"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 ${card.bg} rounded-[1.25rem] flex items-center justify-center ${card.color}`}>
                        <card.icon size={28} />
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black bg-emerald-400/10 px-2 py-1 rounded-full">
                        LIVE
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                    <h3 className="text-3xl font-black">{card.value}</h3>
                  </motion.div>
                ))}
              </div>

              {/* Quick View Logs */}
              <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <h3 className="text-lg font-black">Recent Activity Cluster</h3>
                  <button onClick={() => setActiveTab('activity')} className="text-primary-400 font-black text-[10px] uppercase tracking-widest hover:text-primary-300">
                    View Full Audit
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                        <th className="px-8 py-4">User Node</th>
                        <th className="px-8 py-4">Action Pipeline</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.slice(0, 6).map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/20 rounded-xl flex items-center justify-center text-primary-400 font-black text-xs">
                                {log.user.username[0].toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black">{log.user.username}</span>
                                <span className="text-[10px] text-slate-500 font-medium">{log.ip_address}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold text-slate-300">{log.action}</span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                              <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                              <span className="text-[10px] font-black text-emerald-500 uppercase">Success</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-xl font-black">Comprehensive Activity Audit</h3>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10">
                    <Filter className="w-3 h-3" /> Filter Logs
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                      <th className="px-8 py-4">User Node</th>
                      <th className="px-8 py-4">Action Pipeline</th>
                      <th className="px-8 py-4">Payload Details</th>
                      <th className="px-8 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400 font-black text-xs">
                              {log.user.username[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black">{log.user.username}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{log.ip_address}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-bold text-slate-300">{log.action}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="bg-black/20 p-3 rounded-xl border border-white/5 max-w-xs">
                            <pre className="text-[10px] text-primary-400 font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                              {JSON.stringify(log.details)}
                            </pre>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-xl font-black">Login Security Orchestration</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Brute-Force Shield Active</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                      <th className="px-8 py-4">User Cluster</th>
                      <th className="px-8 py-4">Environment</th>
                      <th className="px-8 py-4">IP Signature</th>
                      <th className="px-8 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLogins.map((login) => (
                      <tr key={login.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-black text-xs">
                              {login.user.username[0].toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black">{login.user.username}</span>
                              <span className="text-[10px] text-slate-500 font-medium">{login.user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-300">{login.device}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-black">{login.browser}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <code className="text-xs bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded text-primary-400 font-mono">
                            {login.ip_address}
                          </code>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-500 font-mono">
                          {new Date(login.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, disabled, onClick }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300
      ${active 
        ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 translate-x-2' 
        : disabled 
          ? 'opacity-30 cursor-not-allowed' 
          : 'text-slate-500 hover:bg-white/5 hover:text-white'
      }
    `}
  >
    <Icon size={20} className={active ? 'animate-pulse' : ''} />
    <span className="text-sm font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default AdminDashboard;
