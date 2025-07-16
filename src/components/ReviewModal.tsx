import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, User, MessageCircle, ThumbsUp, Award } from 'lucide-react';
import GlassCard from './GlassCard';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    avatar: string;
    department: string;
  };
  ticketId: string;
  onSubmitReview: (review: any) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  employee,
  ticketId,
  onSubmitReview
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'professionalism', label: 'Professionalism', icon: '👔' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'timeliness', label: 'Timeliness', icon: '⏰' },
    { id: 'problem-solving', label: 'Problem Solving', icon: '🔧' },
    { id: 'courtesy', label: 'Courtesy', icon: '😊' },
    { id: 'expertise', label: 'Technical Expertise', icon: '🎯' }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    const review = {
      id: Date.now().toString(),
      employeeId: employee.id,
      employeeName: employee.name,
      ticketId,
      rating,
      comment,
      categories: selectedCategories,
      date: new Date().toISOString(),
      status: 'submitted'
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmitReview(review);
    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setRating(0);
    setComment('');
    setSelectedCategories([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <GlassCard className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                  {employee.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Rate Your Experience</h2>
                  <p className="text-white/70">with {employee.name} • {employee.department}</p>
                  <p className="text-violet-400 text-sm">Ticket: {ticketId}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Star Rating */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Overall Rating</h3>
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="relative"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-200 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/30'
                      }`}
                    />
                    {star <= (hoveredRating || rating) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 rounded-full bg-yellow-400/20 blur-lg"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">What did they excel at?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`p-4 rounded-lg border transition-all text-center ${
                      selectedCategories.includes(category.id)
                        ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-500/50 text-white'
                        : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Comments</h3>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience and feedback..."
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: rating === 0 ? 1 : 1.02 }}
              whileTap={{ scale: rating === 0 ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </motion.button>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;