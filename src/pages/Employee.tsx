import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  Mic, 
  Camera, 
  Phone,
  MessageCircle,
  Navigation as NavigationIcon,
  Star,
  User,
  AlertCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const Employee = () => {
  const { user, updateLocation } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Building A, Floor 2');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');

  const assignedTickets = [
    {
      id: 'TKT-2847',
      title: 'Printer not working in office 204',
      priority: 'medium',
      location: 'Building A, Floor 2',
      requester: 'John Smith',
      time: '10:30 AM',
      status: 'assigned',
      estimated: '2 hours',
      description: 'HP LaserJet printer showing paper jam error'
    },
    {
      id: 'TKT-2846',
      title: 'AC unit making strange noise',
      priority: 'high',
      location: 'Building B, Floor 1',
      requester: 'Sarah Johnson',
      time: '9:15 AM',
      status: 'in-progress',
      estimated: '4 hours',
      description: 'Conference room AC making rattling sounds'
    },
    {
      id: 'TKT-2845',
      title: 'WiFi connection issues',
      priority: 'low',
      location: 'Building A, Floor 3',
      requester: 'Mike Wilson',
      time: '2:20 PM',
      status: 'pending',
      estimated: '1 hour',
      description: 'Intermittent connectivity in marketing department'
    }
  ];

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // Simulate location update
    updateLocation({
      lat: 40.7128 + Math.random() * 0.01,
      lng: -74.0060 + Math.random() * 0.01,
      address: currentLocation
    });
    
    setTimeout(() => setIsCheckedIn(false), 3000);
  };

  const handleVoiceNote = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceNote('Voice note recorded: Issue diagnosed, replacement part needed. ETA 30 minutes for resolution.');
    }, 3000);
  };

  const handleResolveTicket = (ticketId: string) => {
    console.log('Resolving ticket:', ticketId);
    // Add resolution animation here
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500/20 text-blue-400';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'pending': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (user?.role !== 'employee') {
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
            <h1 className="text-4xl font-bold text-white mb-2">Employee Portal</h1>
            <p className="text-white/70 text-lg">Manage your assigned tickets and track your work progress</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {/* Check-in Card */}
            <GlassCard className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Check-in</h3>
                <p className="text-white/70 text-sm mb-4">Current: {currentLocation}</p>
                <motion.button
                  onClick={handleCheckIn}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    isCheckedIn 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCheckedIn ? 'Checked In!' : 'Check In'}
                </motion.button>
              </div>
            </GlassCard>

            {/* Voice Note Card */}
            <GlassCard className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Voice Note</h3>
                <p className="text-white/70 text-sm mb-4">Record updates</p>
                <motion.button
                  onClick={handleVoiceNote}
                  className={`w-full py-2 rounded-lg font-medium transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? 'Recording...' : 'Record'}
                </motion.button>
              </div>
            </GlassCard>

            {/* Today's Stats */}
            <GlassCard className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Today's Stats</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-white/70">Completed: <span className="text-green-400 font-medium">8</span></p>
                  <p className="text-white/70">Pending: <span className="text-yellow-400 font-medium">3</span></p>
                  <p className="text-white/70">Rating: <span className="text-blue-400 font-medium">4.9★</span></p>
                </div>
              </div>
            </GlassCard>

            {/* Emergency Alert */}
            <GlassCard className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Emergency</h3>
                <p className="text-white/70 text-sm mb-4">Report urgent issues</p>
                <motion.button
                  className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Alert
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Assigned Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-2xl font-semibold text-white mb-6">Assigned Tickets</h3>
              
              <div className="space-y-6">
                {assignedTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-semibold text-white">{ticket.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-violet-400 font-medium mb-2">{ticket.id}</p>
                        <p className="text-white/70 text-sm mb-3">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{ticket.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{ticket.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <NavigationIcon className="w-4 h-4" />
                            <span>ETA: {ticket.estimated}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {ticket.requester.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="text-white/80 text-sm font-medium">{ticket.requester}</span>
                          <p className="text-white/60 text-xs">Requester</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Phone className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Camera className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleResolveTicket(ticket.id)}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Resolve</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Voice Note Status */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <GlassCard className="p-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 bg-red-500 rounded-full"
                  />
                  <span className="text-white font-medium">Recording voice note...</span>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Voice Note Success */}
          {voiceNote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <GlassCard className="p-4 max-w-md">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm mb-1">Voice Note Recorded</p>
                    <p className="text-white/70 text-xs">{voiceNote}</p>
                  </div>
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

export default Employee;