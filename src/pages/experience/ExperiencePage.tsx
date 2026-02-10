import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Code } from 'lucide-react';

const ExperiencePage: React.FC = () => {
  const sections = [
    {
      title: 'About Me',
      description: 'Manage your personal introduction and profile information',
      icon: <User className="w-8 h-8" />,
      href: '/experience/about-me',
      color: 'bg-blue-500',
    },
    {
      title: 'Contacts',
      description: 'Manage your contact information and social links',
      icon: <Mail className="w-8 h-8" />,
      href: '/experience/contacts',
      color: 'bg-green-500',
    },
    {
      title: 'Experiences',
      description: 'Manage your work experiences and career history',
      icon: <Briefcase className="w-8 h-8" />,
      href: '/experience/experiences',
      color: 'bg-purple-500',
    },
    {
      title: 'Skills',
      description: 'Manage your skills and technical proficiencies',
      icon: <Code className="w-8 h-8" />,
      href: '/experience/skills',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Experience Management</h1>
        <p className="text-gray-600 mt-1">
          Manage your professional experience, skills, and contact information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <Link to={section.href}>
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className={`${section.color} text-white p-3 rounded-lg`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencePage;
