import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Ticket, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Filter,
  Download,
  Plus,
  MapPin,
  Star
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const stats = [
    { 
      label: 'Total Tickets', 
      value: '12,847', 
      change: '+12.5%', 
      icon: Ticket,
      color: 'from-violet-500 to-purple-500'
    },
    { 
      label: 'Active Employees', 
      value: '42', 
      change: '+2.4%', 
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Avg Resolution Time', 
      value: '4.2h', 
      change: '-8.3%', 
      icon: Clock,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Customer Satisfaction', 
      value: '96%', 
      change: '+1.2%', 
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const departments = [
    { name: 'IT Support', tickets: 3245, resolved: 3180, pending: 65, employees: 12 },
    { name: 'Maintenance', tickets: 2847, resolved: 2790, pending: 57, employees: 8 },
    { name: 'Facilities', tickets: 2156, resolved: 2098, pending: 58, employees: 6 },
    { name: 'Security', tickets: 1892, resolved: 1845, pending: 47, employees: 4 },
    { name: 'Cleaning', tickets: 1634, resolved: 1598, pending: 36, employees: 8 },
  ];

  const topPerformers = [
    { name: 'John Doe', tickets: 247, rating: 4.9, department: 'IT Support', avatar: '👨‍💼' },
    { name: 'Jane Smith', tickets: 189, rating: 4.8, department: 'Maintenance', avatar: '👩‍🔧' },
    { name: 'Mike Johnson', tickets: 156, rating: 4.7, department: 'Facilities', avatar: '👨‍🔧' },
    { name: 'Sarah Wilson', tickets: 134, rating: 4.9, department: 'Security', avatar: '👮‍♀️' },
  ];

  const recentTickets = [
    { id: 'TKT-2847', title: 'Network connectivity issues', priority: 'high', status: 'in-progress', time: '10 min ago', location: 'Building A' },
    { id: 'TKT-2846', title: 'Printer maintenance required', priority: 'medium', status: 'pending', time: '23 min ago', location: 'Building B' },
    { id: 'TKT-2845', title: 'HVAC system malfunction', priority: 'critical', status: 'assigned', time: '35 min ago', location: 'Building C' },
    { id: 'TKT-2844', title: 'Software installation request', priority: 'low', status: 'completed', time: '1 hour ago', location: 'Building A' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'assigned': return 'bg-purple-500/20 text-purple-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <GlassCard className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-white/70">You don't have permission to access this page.</p>
          </GlassCard>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-white/70 text-lg">Manage tickets, employees, and system performance</p>
              </div>
              <div className="flex space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="day" className="bg-slate-800">Today</option>
                  <option value="week" className="bg-slate-800">This Week</option>
                  <option value="month" className="bg-slate-800">This Month</option>
                  <option value="year" className="bg-slate-800">This Year</option>
                </select>
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6" hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                      <p className={`text-sm flex items-center ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Department Performance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-white flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3" />
                    Department Performance
                  </h3>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="all" className="bg-slate-800">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.name} value={dept.name.toLowerCase()} className="bg-slate-800">
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <motion.div
                      key={dept.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-medium text-white text-lg">{dept.name}</h4>
                          <p className="text-white/60 text-sm">{dept.employees} employees</p>
                        </div>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-green-400 font-medium">{dept.resolved} resolved</span>
                          <span className="text-yellow-400 font-medium">{dept.pending} pending</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                        <motion.div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(dept.resolved / dept.tickets) * 100}%` }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-white/60">
                        <span>{((dept.resolved / dept.tickets) * 100).toFixed(1)}% completed</span>
                        <span>{dept.tickets} total tickets</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3" />
                  Top Performers
                </h3>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <motion.div
                      key={performer.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="text-2xl">{performer.avatar}</div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{performer.name}</p>
                        <p className="text-white/60 text-sm">{performer.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{performer.tickets} tickets</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm font-medium">{performer.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Recent Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8"
          >
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white flex items-center">
                  <Ticket className="w-6 h-6 mr-3" />
                  Recent Tickets
                </h3>
                <div className="flex space-x-2">
                  <button className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Ticket</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {recentTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{ticket.title}</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <p className="text-violet-400">{ticket.id}</p>
                          <span className="text-white/40">•</span>
                          <div className="flex items-center space-x-1 text-white/60">
                            <MapPin className="w-3 h-3" />
                            <span>{ticket.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className="text-white/60 text-sm">{ticket.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;