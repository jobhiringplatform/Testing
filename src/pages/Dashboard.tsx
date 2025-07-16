import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Clock, CheckCircle, AlertCircle, Users, MapPin, TrendingUp, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { 
      label: 'Total Tickets', 
      value: '2,847', 
      change: '+12.5%', 
      icon: Ticket,
      color: 'from-violet-500 to-purple-500'
    },
    { 
      label: 'Pending', 
      value: '156', 
      change: '+3.2%', 
      icon: Clock,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      label: 'Resolved', 
      value: '2,691', 
      change: '+18.7%', 
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      label: 'Critical', 
      value: '23', 
      change: '-5.3%', 
      icon: AlertCircle,
      color: 'from-red-500 to-pink-500'
    },
  ];

  const recentActivity = [
    { id: 1, type: 'resolved', ticket: 'TKT-2847', time: '2 min ago', user: 'John Doe', description: 'Printer issue resolved' },
    { id: 2, type: 'assigned', ticket: 'TKT-2846', time: '5 min ago', user: 'Jane Smith', description: 'AC maintenance assigned' },
    { id: 3, type: 'created', ticket: 'TKT-2845', time: '8 min ago', user: 'Mike Johnson', description: 'WiFi connectivity issue' },
    { id: 4, type: 'escalated', ticket: 'TKT-2844', time: '12 min ago', user: 'Sarah Wilson', description: 'Security concern escalated' },
  ];

  const employees = [
    { id: 1, name: 'John Doe', status: 'Available', location: 'Building A', avatar: '👨‍💼', tickets: 12 },
    { id: 2, name: 'Jane Smith', status: 'On Route', location: 'Building B', avatar: '👩‍💼', tickets: 8 },
    { id: 3, name: 'Mike Johnson', status: 'Busy', location: 'Building C', avatar: '👨‍🔧', tickets: 15 },
    { id: 4, name: 'Sarah Wilson', status: 'Available', location: 'Building D', avatar: '👩‍🔧', tickets: 6 },
  ];

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {getWelcomeMessage()}, {user?.name}! 👋
                </h1>
                <p className="text-white/70 text-lg">
                  Here's what's happening with your service tickets today.
                </p>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="hidden md:block"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </motion.div>
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
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + activity.id * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'resolved' ? 'bg-green-500' :
                        activity.type === 'assigned' ? 'bg-blue-500' :
                        activity.type === 'created' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}>
                        {activity.type === 'resolved' ? <CheckCircle className="w-5 h-5 text-white" /> :
                         activity.type === 'assigned' ? <Users className="w-5 h-5 text-white" /> :
                         activity.type === 'created' ? <Ticket className="w-5 h-5 text-white" /> :
                         <AlertCircle className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-white font-medium">{activity.ticket}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.type === 'resolved' ? 'bg-green-500/20 text-green-400' :
                            activity.type === 'assigned' ? 'bg-blue-500/20 text-blue-400' :
                            activity.type === 'created' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm">{activity.description}</p>
                        <p className="text-white/50 text-xs mt-1">{activity.user} • {activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Team Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3" />
                  Team Status
                </h3>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + employee.id * 0.1 }}
                      className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="text-2xl">{employee.avatar}</div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{employee.name}</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-3 h-3 text-white/50" />
                          <span className="text-white/70">{employee.location}</span>
                        </div>
                        <p className="text-white/50 text-xs">{employee.tickets} active tickets</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                          employee.status === 'On Route' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8"
          >
            <GlassCard className="p-6">
              <h3 className="text-2xl font-semibold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl text-white font-medium hover:from-violet-600 hover:to-purple-600 transition-all flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Ticket className="w-5 h-5" />
                  <span>Create New Ticket</span>
                </motion.button>
                
                <motion.button
                  className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Track Location</span>
                </motion.button>
                
                <motion.button
                  className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users className="w-5 h-5" />
                  <span>Contact Support</span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;