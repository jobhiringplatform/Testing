import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Navigation
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const employees = [
    {
      id: 'emp-1',
      name: 'John Technician',
      email: 'john@company.com',
      phone: '+1 (555) 123-4567',
      department: 'IT Support',
      role: 'Senior Technician',
      status: 'available',
      location: {
        current: 'Building A, Floor 2',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      stats: {
        ticketsResolved: 247,
        rating: 4.9,
        responseTime: '12 min',
        completionRate: 98
      },
      avatar: '👨‍🔧',
      lastActive: '2 min ago',
      currentTicket: 'TKT-2847'
    },
    {
      id: 'emp-2',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      phone: '+1 (555) 234-5678',
      department: 'Maintenance',
      role: 'Maintenance Specialist',
      status: 'on-route',
      location: {
        current: 'En route to Building C',
        coordinates: { lat: 40.7589, lng: -73.9851 }
      },
      stats: {
        ticketsResolved: 189,
        rating: 4.8,
        responseTime: '8 min',
        completionRate: 95
      },
      avatar: '👩‍🔧',
      lastActive: '5 min ago',
      currentTicket: 'TKT-2846'
    },
    {
      id: 'emp-3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      phone: '+1 (555) 345-6789',
      department: 'Security',
      role: 'Security Officer',
      status: 'busy',
      location: {
        current: 'Building B, Security Desk',
        coordinates: { lat: 40.7505, lng: -73.9934 }
      },
      stats: {
        ticketsResolved: 156,
        rating: 4.7,
        responseTime: '15 min',
        completionRate: 92
      },
      avatar: '👮‍♂️',
      lastActive: '1 min ago',
      currentTicket: 'TKT-2845'
    },
    {
      id: 'emp-4',
      name: 'Lisa Chen',
      email: 'lisa@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Facilities',
      role: 'Facilities Manager',
      status: 'offline',
      location: {
        current: 'Off Duty',
        coordinates: { lat: 0, lng: 0 }
      },
      stats: {
        ticketsResolved: 134,
        rating: 4.9,
        responseTime: '10 min',
        completionRate: 97
      },
      avatar: '👩‍💼',
      lastActive: '2 hours ago',
      currentTicket: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'on-route': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'busy': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'offline': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <h1 className="text-4xl font-bold text-white mb-2">Employee Management</h1>
                <p className="text-white/70">Monitor and manage your workforce in real-time</p>
              </div>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Employee</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="all" className="bg-slate-800">All Status</option>
                    <option value="available" className="bg-slate-800">Available</option>
                    <option value="on-route" className="bg-slate-800">On Route</option>
                    <option value="busy" className="bg-slate-800">Busy</option>
                    <option value="offline" className="bg-slate-800">Offline</option>
                  </select>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 h-full" hover>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{employee.avatar}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                        <p className="text-white/60 text-sm">{employee.role}</p>
                        <p className="text-violet-400 text-xs">{employee.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                      <button className="p-1 text-white/50 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-white/70">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{employee.location.current}</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Last active: {employee.lastActive}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{employee.stats.ticketsResolved}</p>
                      <p className="text-white/60 text-xs">Tickets</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <p className="text-xl font-bold text-white">{employee.stats.rating}</p>
                      </div>
                      <p className="text-white/60 text-xs">Rating</p>
                    </div>
                  </div>

                  {/* Current Ticket */}
                  {employee.currentTicket && (
                    <div className="mb-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                      <p className="text-violet-400 text-sm font-medium">Current Ticket</p>
                      <p className="text-white text-sm">{employee.currentTicket}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center space-x-2">
                      <Navigation className="w-4 h-4" />
                      <span className="text-sm">Track</span>
                    </button>
                    <button className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Live Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Live Employee Locations
              </h3>
              
              <div className="h-96 bg-slate-800 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                
                {/* Simulated Map with Employee Markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-8">
                    {employees.filter(emp => emp.status !== 'offline').map((employee, index) => (
                      <motion.div
                        key={employee.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + index * 0.2 }}
                        className="relative"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            boxShadow: [
                              '0 0 0 0 rgba(139, 92, 246, 0.7)',
                              '0 0 0 10px rgba(139, 92, 246, 0)',
                              '0 0 0 0 rgba(139, 92, 246, 0)'
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl cursor-pointer"
                          onClick={() => setSelectedEmployee(employee.id)}
                        >
                          {employee.avatar}
                        </motion.div>
                        
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                          <p className="text-white text-sm font-medium">{employee.name}</p>
                          <p className="text-white/60 text-xs">{employee.location.current}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <button className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EmployeeManagement;