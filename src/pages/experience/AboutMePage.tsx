import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { aboutMeApi, type AboutMe } from '@/services/experienceApi';
import { AboutMeForm } from './AboutMeForm';

const AboutMePage: React.FC = () => {
  const [data, setData] = useState<AboutMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AboutMe>>({});

  const fetchAboutMe = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await aboutMeApi.getAboutMe();
      setData(apiData);
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        // No about me exists yet, that's okay
        setData(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load about me');
        console.error('Failed to fetch about me:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutMe();
  }, []);

  const handleEdit = () => {
    setFormData(data || { title: 'About Me', content: '', image: '' });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({});
    fetchAboutMe();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading about me...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">About Me</h1>
            <p className="text-gray-600 mt-1">
              Manage your about me information
            </p>
          </div>
          <Button onClick={handleEdit} className="gap-2">
            {data ? 'Edit About Me' : 'Create About Me'}
          </Button>
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">Error: {error}</p>
          </div>
        )}
      </div>

      {data ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{data.title}</h2>
            </div>
            {data.image && (
              <div>
                <img
                  src={data.image}
                  alt="About me"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <div>
              <p className="text-gray-700 whitespace-pre-wrap">{data.content}</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Last updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No about me information found</p>
          <p className="text-gray-400 mt-2">Click "Create About Me" to get started</p>
        </div>
      )}

      <AboutMeForm
        formData={formData}
        handleModalClose={handleModalClose}
        modalOpen={modalOpen}
      />
    </div>
  );
};

export default AboutMePage;
