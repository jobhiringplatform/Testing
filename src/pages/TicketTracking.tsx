import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, User, Clock, CheckCircle, MessageCircle, Phone, Navigation as NavigationIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';

const TicketTracking = () => {
  const [trackingId, setTrackingId] = useState('TKT-2847');
  const [ticketData] = useState({
    id: 'TKT-2847',
    title: 'Printer not working in office 204',
    status: 'in-progress',
    priority: 'medium',
    created: '2025-01-02 10:30',
    employee: {
      name: 'John Doe',
      avatar: '👨‍💼',
      phone: '+1 (555) 123-4567',
      location: { lat: 40.7128, lng: -74.0060 },
      status: 'On Route'
    },
    timeline: [
      { 
        status: 'created', 
        time: '2025-01-02 10:30', 
        description: 'Ticket created and submitted',
        completed: true 
      },
      { 
        status: 'assigned', 
        time: '2025-01-02 10:45', 
        description: 'Assigned to John Doe',
        completed: true 
      },
      { 
        status: 'in-progress', 
        time: '2025-01-02 11:15', 
        description: 'Technician en route to location',
        completed: true 
      },
      { 
        status: 'completed', 
        time: 'Estimated: 2025-01-02 13:00', 
        description: 'Issue resolution and ticket closure',
        completed: false 
      }
    ]
  });

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'employee', text: 'On my way to your location. ETA 10 minutes.', time: '11:15', avatar: '👨‍💼' },
    { id: 2, sender: 'user', text: 'Thank you! I will be waiting in the office.', time: '11:16', avatar: '👤' },
    { id: 3, sender: 'employee', text: 'Arrived at location. Starting diagnosis.', time: '11:25', avatar: '👨‍💼' },
    { id: 4, sender: 'system', text: 'Technician has checked in at your location.', time: '11:25', avatar: '🤖' }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleTrackTicket = () => {
    console.log('Tracking ticket:', trackingId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now(),
        sender: 'user',
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        avatar: '👤'
      }]);
      setNewMessage('');
      
      // Simulate employee response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'employee',
          text: 'Got it! I\'ll keep you updated on the progress.',
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          avatar: '👨‍💼'
        }]);
      }, 2000);
    }
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
            <h1 className="text-4xl font-bold text-white mb-2">Track Your Ticket</h1>
            <p className="text-white/70 text-lg">Monitor real-time progress and communicate with your technician</p>
          </motion.div>

          {/* Tracking Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <GlassCard className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter ticket ID (e.g., TKT-2847)"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                <motion.button
                  onClick={handleTrackTicket}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Track
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Timeline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6 mb-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Progress Timeline</h3>
                
                <div className="space-y-6">
                  {ticketData.timeline.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-500' 
                            : index === ticketData.timeline.findIndex(s => !s.completed)
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-gray-500'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-5 h-5 text-white" />
                          )}
                        </div>
                        {index < ticketData.timeline.length - 1 && (
                          <div className={`w-0.5 h-8 ml-5 mt-2 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-white capitalize text-lg">{step.status.replace('-', ' ')}</h4>
                          <span className="text-sm text-white/70">{step.time}</span>
                        </div>
                        <p className="text-white/80">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Live Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-3" />
                    Live Location Tracking
                  </h3>
                  <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                    <div className="text-center relative z-10">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <User className="w-10 h-10 text-white" />
                      </motion.div>
                      <p className="text-white font-medium text-lg">{ticketData.employee.name}</p>
                      <p className="text-white/70">{ticketData.employee.status}</p>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <NavigationIcon className="w-4 h-4 text-violet-400" />
                        <span className="text-violet-400 text-sm">ETA: 5 minutes</span>
                      </div>
                    </div>
                    
                    {/* Animated route line */}
                    <motion.div
                      className="absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>

            {/* Employee Info & Chat */}
            <div className="space-y-8">
              {/* Employee Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Assigned Technician</h3>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-4xl">{ticketData.employee.avatar}</div>
                    <div>
                      <p className="text-white font-medium text-lg">{ticketData.employee.name}</p>
                      <p className="text-white/70">{ticketData.employee.status}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Online</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call {ticketData.employee.name}</span>
                  </motion.button>
                </GlassCard>
              </motion.div>

              {/* Live Chat */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Live Chat
                  </h3>
                  
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-violet-500 text-white'
                            : message.sender === 'system'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs">{message.avatar}</span>
                            <span className="text-xs opacity-70">{message.time}</span>
                          </div>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketTracking;