import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl ${className}`}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)' 
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;