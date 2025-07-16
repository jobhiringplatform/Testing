import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || 'John Doe',
      email: user?.email || 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      department: 'IT Support',
      location: 'Building A, Floor 2',
      bio: 'Experienced technician specializing in IT support and maintenance.'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      ticketUpdates: true,
      assignments: true,
      deadlines: true,
      marketing: false
    },
    appearance: {
      theme: 'dark',
      accentColor: 'violet',
      animations: true,
      compactMode: false,
      language: 'en'
    },
    privacy: {
      locationTracking: true,
      dataCollection: false,
      analytics: true,
      publicProfile: false,
      twoFactor: false
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield }
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Settings saved:', settings);
    // Show success animation
    const button = document.querySelector('.save-button');
    button?.classList.add('animate-pulse');
    setTimeout(() => {
      button?.classList.remove('animate-pulse');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-white/70 text-lg">Customize your experience and preferences</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:w-64"
            >
              <GlassCard className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white border border-violet-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </GlassCard>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex-1"
            >
              <GlassCard className="p-8">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Profile Settings</h2>
                    
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Profile Picture</h3>
                        <p className="text-white/60 text-sm mb-2">Update your profile picture</p>
                        <button className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                          Change Photo
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={settings.profile.name}
                          onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <Globe className="w-4 h-4 inline mr-2" />
                          Department
                        </label>
                        <select
                          value={settings.profile.department}
                          onChange={(e) => handleInputChange('profile', 'department', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        >
                          <option value="IT Support" className="bg-slate-800">IT Support</option>
                          <option value="Maintenance" className="bg-slate-800">Maintenance</option>
                          <option value="Security" className="bg-slate-800">Security</option>
                          <option value="Facilities" className="bg-slate-800">Facilities</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Location
                        </label>
                        <input
                          type="text"
                          value={settings.profile.location}
                          onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={settings.profile.bio}
                          onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'email', icon: Mail, title: 'Email Notifications', desc: 'Receive updates via email' },
                        { key: 'push', icon: Smartphone, title: 'Push Notifications', desc: 'Receive push notifications on your device' },
                        { key: 'sms', icon: Phone, title: 'SMS Notifications', desc: 'Receive text messages for urgent updates' },
                        { key: 'ticketUpdates', icon: Bell, title: 'Ticket Updates', desc: 'Get notified when tickets are updated' },
                        { key: 'assignments', icon: User, title: 'New Assignments', desc: 'Notifications for new ticket assignments' },
                        { key: 'deadlines', icon: Bell, title: 'Deadline Reminders', desc: 'Reminders for approaching deadlines' },
                        { key: 'marketing', icon: Mail, title: 'Marketing Updates', desc: 'Product updates and newsletters' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 text-white/70" />
                            <div>
                              <p className="text-white font-medium">{item.title}</p>
                              <p className="text-white/70 text-sm">{item.desc}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                              onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Appearance</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">
                          Theme
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {['dark', 'light'].map((theme) => (
                            <motion.button
                              key={theme}
                              onClick={() => handleInputChange('appearance', 'theme', theme)}
                              className={`p-4 rounded-lg border transition-all ${
                                settings.appearance.theme === theme
                                  ? 'bg-violet-500/20 border-violet-500 text-white'
                                  : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="capitalize font-medium">{theme}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">
                          Accent Color
                        </label>
                        <div className="flex space-x-3">
                          {[
                            { name: 'violet', color: '#8b5cf6' },
                            { name: 'blue', color: '#3b82f6' },
                            { name: 'green', color: '#10b981' },
                            { name: 'red', color: '#ef4444' },
                            { name: 'orange', color: '#f97316' }
                          ].map((color) => (
                            <motion.button
                              key={color.name}
                              onClick={() => handleInputChange('appearance', 'accentColor', color.name)}
                              className={`w-10 h-10 rounded-full border-2 transition-all ${
                                settings.appearance.accentColor === color.name
                                  ? 'border-white scale-110'
                                  : 'border-white/30 hover:border-white/50'
                              }`}
                              style={{ backgroundColor: color.color }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          { key: 'animations', title: 'Animations', desc: 'Enable smooth transitions and animations' },
                          { key: 'compactMode', title: 'Compact Mode', desc: 'Use a more compact layout' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <p className="text-white font-medium">{item.title}</p>
                              <p className="text-white/70 text-sm">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.appearance[item.key as keyof typeof settings.appearance] as boolean}
                                onChange={(e) => handleInputChange('appearance', item.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy & Security Settings */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Privacy & Security</h2>
                    
                    <div className="space-y-6">
                      {/* Privacy Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Privacy</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'locationTracking', icon: MapPin, title: 'Location Tracking', desc: 'Allow location tracking for better service' },
                            { key: 'dataCollection', icon: Shield, title: 'Data Collection', desc: 'Allow data collection for improvement' },
                            { key: 'analytics', icon: Globe, title: 'Analytics', desc: 'Help improve the service with usage analytics' },
                            { key: 'publicProfile', icon: User, title: 'Public Profile', desc: 'Make your profile visible to other users' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-center space-x-3">
                                <item.icon className="w-5 h-5 text-white/70" />
                                <div>
                                  <p className="text-white font-medium">{item.title}</p>
                                  <p className="text-white/70 text-sm">{item.desc}</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.privacy[item.key as keyof typeof settings.privacy] as boolean}
                                  onChange={(e) => handleInputChange('privacy', item.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Security</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-white font-medium">Two-Factor Authentication</p>
                                <p className="text-white/70 text-sm">Add an extra layer of security</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.privacy.twoFactor}
                                  onChange={(e) => handleInputChange('privacy', 'twoFactor', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                              </label>
                            </div>
                          </div>

                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="text-white font-medium mb-4">Change Password</h4>
                            <div className="space-y-4">
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Current Password"
                                  value={settings.security.currentPassword}
                                  onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
                                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all pr-12"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                >
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={settings.security.newPassword}
                                onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              />
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={settings.security.confirmPassword}
                                onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="pt-8 border-t border-white/10">
                  <motion.button
                    onClick={handleSave}
                    className="save-button w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Settings</span>
                  </motion.button>
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

export default Settings;