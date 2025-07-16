import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Filter, 
  Search, 
  TrendingUp, 
  Award, 
  Users, 
  MessageCircle,
  Calendar,
  BarChart3,
  Eye,
  Download
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const ReviewsManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const reviews = [
    {
      id: 'REV-001',
      employeeId: 'emp-1',
      employeeName: 'John Technician',
      employeeAvatar: '👨‍🔧',
      department: 'IT Support',
      ticketId: 'TKT-2847',
      rating: 5,
      comment: 'Excellent service! John was very professional and solved the printer issue quickly. Great communication throughout the process.',
      categories: ['professionalism', 'communication', 'timeliness', 'problem-solving'],
      reviewerName: 'Sarah Johnson',
      date: '2025-01-02T14:30:00Z',
      status: 'published'
    },
    {
      id: 'REV-002',
      employeeId: 'emp-2',
      employeeName: 'Mike Wilson',
      employeeAvatar: '👨‍💼',
      department: 'Maintenance',
      ticketId: 'TKT-2846',
      rating: 4,
      comment: 'Good work on the AC repair. Arrived on time and explained the issue clearly. Could improve on cleanup after work.',
      categories: ['timeliness', 'expertise', 'communication'],
      reviewerName: 'David Chen',
      date: '2025-01-02T11:15:00Z',
      status: 'published'
    },
    {
      id: 'REV-003',
      employeeId: 'emp-1',
      employeeName: 'John Technician',
      employeeAvatar: '👨‍🔧',
      department: 'IT Support',
      ticketId: 'TKT-2845',
      rating: 5,
      comment: 'Outstanding technical expertise! Fixed our network issues and provided helpful tips for prevention.',
      categories: ['expertise', 'professionalism', 'problem-solving'],
      reviewerName: 'Lisa Martinez',
      date: '2025-01-01T16:45:00Z',
      status: 'published'
    },
    {
      id: 'REV-004',
      employeeId: 'emp-3',
      employeeName: 'Sarah Wilson',
      employeeAvatar: '👩‍🔧',
      department: 'Security',
      ticketId: 'TKT-2844',
      rating: 3,
      comment: 'Resolved the security issue but took longer than expected. Communication could be better.',
      categories: ['problem-solving'],
      reviewerName: 'Robert Kim',
      date: '2025-01-01T09:20:00Z',
      status: 'published'
    }
  ];

  const employeeStats = [
    {
      employeeId: 'emp-1',
      name: 'John Technician',
      avatar: '👨‍🔧',
      department: 'IT Support',
      averageRating: 4.9,
      totalReviews: 47,
      ratingDistribution: { 5: 42, 4: 4, 3: 1, 2: 0, 1: 0 },
      topCategories: ['professionalism', 'expertise', 'problem-solving']
    },
    {
      employeeId: 'emp-2',
      name: 'Mike Wilson',
      avatar: '👨‍💼',
      department: 'Maintenance',
      averageRating: 4.2,
      totalReviews: 23,
      ratingDistribution: { 5: 12, 4: 8, 3: 3, 2: 0, 1: 0 },
      topCategories: ['timeliness', 'communication', 'expertise']
    },
    {
      employeeId: 'emp-3',
      name: 'Sarah Wilson',
      avatar: '👩‍🔧',
      department: 'Security',
      averageRating: 3.8,
      totalReviews: 15,
      ratingDistribution: { 5: 6, 4: 4, 3: 4, 2: 1, 1: 0 },
      topCategories: ['problem-solving', 'professionalism']
    }
  ];

  const overallStats = {
    averageRating: 4.5,
    totalReviews: 85,
    satisfactionRate: 94,
    responseRate: 87
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 3.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesDepartment = departmentFilter === 'all' || review.department === departmentFilter;
    return matchesSearch && matchesRating && matchesDepartment;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                <h1 className="text-4xl font-bold text-white mb-2">Reviews & Ratings</h1>
                <p className="text-white/70 text-lg">Monitor employee performance and customer satisfaction</p>
              </div>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                <span>Export Report</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Average Rating', value: overallStats.averageRating.toFixed(1), icon: Star, color: 'from-yellow-500 to-orange-500' },
              { label: 'Total Reviews', value: overallStats.totalReviews.toString(), icon: MessageCircle, color: 'from-blue-500 to-cyan-500' },
              { label: 'Satisfaction Rate', value: `${overallStats.satisfactionRate}%`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
              { label: 'Response Rate', value: `${overallStats.responseRate}%`, icon: Users, color: 'from-violet-500 to-purple-500' }
            ].map((stat, index) => (
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
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
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
            {/* Employee Performance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-1"
            >
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Top Performers
                </h3>
                <div className="space-y-4">
                  {employeeStats.map((employee, index) => (
                    <motion.div
                      key={employee.employeeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">{employee.avatar}</div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{employee.name}</p>
                          <p className="text-white/60 text-sm">{employee.department}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className={`font-bold ${getRatingColor(employee.averageRating)}`}>
                              {employee.averageRating}
                            </span>
                          </div>
                          <p className="text-white/60 text-xs">{employee.totalReviews} reviews</p>
                        </div>
                      </div>
                      
                      {/* Rating Distribution */}
                      <div className="space-y-1">
                        {[5, 4, 3, 2, 1].map(rating => {
                          const count = employee.ratingDistribution[rating as keyof typeof employee.ratingDistribution];
                          const percentage = (count / employee.totalReviews) * 100;
                          return (
                            <div key={rating} className="flex items-center space-x-2 text-xs">
                              <span className="text-white/60 w-2">{rating}</span>
                              <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                                <motion.div
                                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1.5 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                />
                              </div>
                              <span className="text-white/60 w-6">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Reviews List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Recent Reviews
                  </h3>
                  <div className="flex space-x-2">
                    <select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="all" className="bg-slate-800">All Ratings</option>
                      <option value="5" className="bg-slate-800">5 Stars</option>
                      <option value="4" className="bg-slate-800">4 Stars</option>
                      <option value="3" className="bg-slate-800">3 Stars</option>
                      <option value="2" className="bg-slate-800">2 Stars</option>
                      <option value="1" className="bg-slate-800">1 Star</option>
                    </select>
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="all" className="bg-slate-800">All Departments</option>
                      <option value="IT Support" className="bg-slate-800">IT Support</option>
                      <option value="Maintenance" className="bg-slate-800">Maintenance</option>
                      <option value="Security" className="bg-slate-800">Security</option>
                      <option value="Facilities" className="bg-slate-800">Facilities</option>
                    </select>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reviews..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Reviews */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{review.employeeAvatar}</div>
                          <div>
                            <p className="text-white font-medium">{review.employeeName}</p>
                            <p className="text-white/60 text-sm">{review.department}</p>
                            <p className="text-violet-400 text-xs">{review.ticketId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-white/60 text-xs">{formatDate(review.date)}</p>
                        </div>
                      </div>
                      
                      <p className="text-white/80 mb-3 text-sm leading-relaxed">{review.comment}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {review.categories.map(category => (
                            <span
                              key={category}
                              className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-medium"
                            >
                              {category.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                        <p className="text-white/60 text-xs">by {review.reviewerName}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewsManagement;