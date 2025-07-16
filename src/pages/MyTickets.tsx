import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, CheckCircle, AlertCircle, Calendar, User, Mic, Eye, MessageCircle, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import ReviewModal from '../components/ReviewModal';

const MyTickets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    employee?: any;
    ticketId?: string;
  }>({ isOpen: false });

  const tickets = [
    {
      id: 'TKT-2847',
      title: 'Printer not working in office 204',
      description: 'The HP LaserJet printer is showing paper jam error but there is no paper stuck.',
      status: 'pending',
      priority: 'medium',
      created: '2025-01-02 10:30',
      employee: 'John Doe',
      location: 'Building A, Floor 2',
      estimatedTime: '2 hours',
      category: 'IT Support',
      canReview: false
    },
    {
      id: 'TKT-2846',
      title: 'AC unit making strange noise',
      description: 'Air conditioning unit in conference room B is making loud rattling sounds.',
      status: 'in-progress',
      priority: 'high',
      created: '2025-01-02 09:15',
      employee: 'Jane Smith',
      location: 'Building B, Floor 1',
      estimatedTime: '4 hours',
      category: 'Maintenance',
      canReview: false
    },
    {
      id: 'TKT-2845',
      title: 'WiFi connection issues',
      description: 'Internet connectivity is intermittent in the marketing department.',
      status: 'resolved',
      priority: 'low',
      created: '2025-01-01 14:20',
      employee: 'Mike Johnson',
      location: 'Building A, Floor 3',
      estimatedTime: 'Completed',
      category: 'IT Support',
      canReview: true
    },
    {
      id: 'TKT-2844',
      title: 'Broken window in lobby',
      description: 'Glass window near the main entrance has a crack and needs immediate attention.',
      status: 'critical',
      priority: 'critical',
      created: '2025-01-01 08:45',
      employee: 'Sarah Wilson',
      location: 'Building A, Lobby',
      estimatedTime: '6 hours',
      category: 'Facilities',
      canReview: false
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <User className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVoiceSearch = () => {
    setIsVoiceSearch(true);
    setTimeout(() => {
      setIsVoiceSearch(false);
      setSearchQuery('printer office');
    }, 2000);
  };

  const handleOpenReview = (ticket: any) => {
    setReviewModal({
      isOpen: true,
      employee: {
        id: 'emp-1',
        name: ticket.employee,
        avatar: '👨‍🔧',
        department: ticket.category
      },
      ticketId: ticket.id
    });
  };

  const handleSubmitReview = (review: any) => {
    console.log('Review submitted:', review);
    // Here you would typically send the review to your backend
  };

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
            <h1 className="text-4xl font-bold text-white mb-2">My Tickets</h1>
            <p className="text-white/70 text-lg">Manage and track your service requests</p>
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
                    placeholder="Search tickets..."
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  <button
                    onClick={handleVoiceSearch}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                      isVoiceSearch ? 'text-red-400' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="all" className="bg-slate-800">All Status</option>
                    <option value="pending" className="bg-slate-800">Pending</option>
                    <option value="in-progress" className="bg-slate-800">In Progress</option>
                    <option value="resolved" className="bg-slate-800">Resolved</option>
                    <option value="critical" className="bg-slate-800">Critical</option>
                  </select>
                </div>
              </div>

              {isVoiceSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-red-500 rounded-full"
                    />
                    <span className="text-white/70 text-sm">Listening for search query...</span>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 h-full" hover>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">{ticket.title}</h3>
                      </div>
                      <p className="text-violet-400 font-medium mb-1">{ticket.id}</p>
                      <span className="text-white/60 text-sm">{ticket.category}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="text-sm font-medium capitalize">{ticket.status}</span>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4 line-clamp-2">{ticket.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-white/70">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Created: {ticket.created}</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <User className="w-4 h-4 mr-2" />
                      <span>Assigned to: {ticket.employee}</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Estimated: {ticket.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} priority
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </motion.button>
                      {ticket.canReview && (
                        <motion.button
                          onClick={() => handleOpenReview(ticket)}
                          className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Star className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-medium hover:from-violet-600 hover:to-purple-600 transition-all flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </motion.button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Review Modal */}
          <ReviewModal
            isOpen={reviewModal.isOpen}
            onClose={() => setReviewModal({ isOpen: false })}
            employee={reviewModal.employee}
            ticketId={reviewModal.ticketId || ''}
            onSubmitReview={handleSubmitReview}
          />

          {/* Empty State */}
          {filteredTickets.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center py-12"
            >
              <GlassCard className="p-8">
                <div className="text-white/50 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyTickets;