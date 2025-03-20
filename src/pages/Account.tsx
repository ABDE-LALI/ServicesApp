import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { User, Phone, Globe, MapPin, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface Profile {
  username: string;
  phone_primary: string;
  phone_secondary: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  location_lat: number | null;
  location_lng: number | null;
  preferred_language: string;
  is_provider: boolean;
}

export const Account = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<Profile>({
    username: '',
    phone_primary: '',
    phone_secondary: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    location_lat: null,
    location_lng: null,
    preferred_language: 'en',
    is_provider: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // First check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({ id: user?.id })
            .single();

          if (createError) throw createError;

          // Fetch the newly created profile
          const { data: newData, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();

          if (fetchError) throw fetchError;
          setProfile({
            username: newData.username || '',
            phone_primary: newData.phone_primary || '',
            phone_secondary: newData.phone_secondary || '',
            whatsapp: newData.whatsapp || '',
            facebook: newData.facebook || '',
            instagram: newData.instagram || '',
            location_lat: newData.location_lat,
            location_lng: newData.location_lng,
            preferred_language: newData.preferred_language || 'en',
            is_provider: newData.is_provider || false,
          });
        } else {
          throw error;
        }
      } else {
        setProfile({
          username: data.username || '',
          phone_primary: data.phone_primary || '',
          phone_secondary: data.phone_secondary || '',
          whatsapp: data.whatsapp || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          location_lat: data.location_lat,
          location_lng: data.location_lng,
          preferred_language: data.preferred_language || 'en',
          is_provider: data.is_provider || false,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSuccessMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <User size={32} className="text-primary" />
            <h1 className="text-3xl font-bold text-neutral">Account Settings</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 text-red-500 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-green-50 text-green-500 p-4 rounded-lg mb-6"
          >
            {successMessage}
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Phone
              </label>
              <input
                type="tel"
                value={profile.phone_primary}
                onChange={(e) => setProfile({ ...profile, phone_primary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Phone
              </label>
              <input
                type="tel"
                value={profile.phone_secondary}
                onChange={(e) => setProfile({ ...profile, phone_secondary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={profile.facebook}
                onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={profile.instagram}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};