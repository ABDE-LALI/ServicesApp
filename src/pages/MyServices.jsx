import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../lib/store';
import { Eye, Star, MapPin, Plus, X, Phone, Mail, Link as LinkIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export const MyServices = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newService, setNewService] = useState({
    category_id: '',
    name_en: '',
    name_ar: '',
    name_fr: '',
    description_en: '',
    description_ar: '',
    description_fr: '',
    phone: '',
    email: '',
    website: '',
    location_lat: null,
    location_lng: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyServices();
      fetchCategories();
    }
  }, [user]);

  const fetchMyServices = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_services')
        .select(`
          *,
          service:services(
            name_en,
            name_ar,
            name_fr,
            description_en,
            description_ar,
            description_fr,
            image_url
          )
        `)
        .eq('provider_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.category_id || !selectedLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      // First, create the service
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .insert({
          category_id: newService.category_id,
          name_en: newService.name_en,
          name_ar: newService.name_ar,
          name_fr: newService.name_fr,
          description_en: newService.description_en,
          description_ar: newService.description_ar,
          description_fr: newService.description_fr,
        })
        .select()
        .single();

      if (serviceError) throw serviceError;

      // Then, create the provider service
      const { data: providerServiceData, error: providerServiceError } = await supabase
        .from('provider_services')
        .insert({
          provider_id: user.id,
          service_id: serviceData.id,
          location_lat: selectedLocation[0],
          location_lng: selectedLocation[1],
          active: true,
          contact_phone: newService.phone,
          contact_email: newService.email,
          contact_website: newService.website,
        })
        .select()
        .single();

      if (providerServiceError) throw providerServiceError;

      await fetchMyServices();
      setIsAddingService(false);
      setNewService({
        category_id: '',
        name_en: '',
        name_ar: '',
        name_fr: '',
        description_en: '',
        description_ar: '',
        description_fr: '',
        phone: '',
        email: '',
        website: '',
        location_lat: null,
        location_lng: null,
      });
      setSelectedLocation(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalizedName = (item) => {
    switch (i18n.language) {
      case 'ar':
        return item.name_ar;
      case 'fr':
        return item.name_fr;
      default:
        return item.name_en;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral">{t('nav.myServices')}</h1>
        <button
          onClick={() => setIsAddingService(true)}
          className="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>{t('myServices.addNew')}</span>
        </button>
      </div>

      <AnimatePresence>
        {isAddingService && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral">Add New Service</h2>
                <button
                  onClick={() => setIsAddingService(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddService} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newService.category_id}
                    onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {getLocalizedName(category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (English)
                    </label>
                    <input
                      type="text"
                      value={newService.name_en}
                      onChange={(e) => setNewService({ ...newService, name_en: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (Arabic)
                    </label>
                    <input
                      type="text"
                      value={newService.name_ar}
                      onChange={(e) => setNewService({ ...newService, name_ar: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (French)
                    </label>
                    <input
                      type="text"
                      value={newService.name_fr}
                      onChange={(e) => setNewService({ ...newService, name_fr: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English)
                    </label>
                    <textarea
                      value={newService.description_en}
                      onChange={(e) => setNewService({ ...newService, description_en: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Arabic)
                    </label>
                    <textarea
                      value={newService.description_ar}
                      onChange={(e) => setNewService({ ...newService, description_ar: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (French)
                    </label>
                    <textarea
                      value={newService.description_fr}
                      onChange={(e) => setNewService({ ...newService, description_fr: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={newService.phone}
                        onChange={(e) => setNewService({ ...newService, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={newService.email}
                        onChange={(e) => setNewService({ ...newService, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="url"
                        value={newService.website}
                        onChange={(e) => setNewService({ ...newService, website: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Click on map to set location)
                  </label>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapContainer
                      center={[25.2048, 55.2708]}
                      zoom={11}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker onLocationSelect={setSelectedLocation} />
                      {selectedLocation && (
                        <Marker position={selectedLocation} />
                      )}
                    </MapContainer>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingService(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !selectedLocation || !newService.category_id}
                    className="bg-primary hover:bg-primary-light text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Adding...' : 'Add Service'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={service.service.image_url}
              alt={getLocalizedName(service.service)}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-neutral">
                  {getLocalizedName(service.service)}
                </h2>
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-500">{service.views_count}</span>
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm text-gray-500">
                    {service.rating_avg.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin size={16} />
                <span className="text-sm">
                  {service.location_lat.toFixed(6)}, {service.location_lng.toFixed(6)}
                </span>
              </div>

              <div className="flex justify between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    service.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {service.active ? t('myServices.active') : t('myServices.inactive')}
                </span>
                <button className="text-primary hover:text-primary-light transition-colors">
                  {t('myServices.edit')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};