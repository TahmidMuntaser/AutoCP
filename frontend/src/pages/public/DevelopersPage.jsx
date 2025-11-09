import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Globe,
  Code2,
  Award,
  Users,
  Sparkles
} from 'lucide-react';
import { Skeleton } from '../../components/Loading/SkeletonLoader';

const DevelopersPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const developers = [
    {
      name: 'Tarin Prosad Ghosh',
      role: 'Project Lead | Backend Developer | DevOps Specialist',
      description: 'Leading the AutoCP project with expertise in backend development and DevOps practices.',
      image: '/images/team/tarin.jpg',
      skills: ['Node.js', 'Express', 'Docker', 'DevOps'],
      github: 'https://github.com/DurjoyGH',
      linkedin: 'https://www.linkedin.com/in/durjoy-ghosh-just',
      email: 'tarinprosadghosh@gmail.com',
      website: 'https://tarinprosadghosh.me'
    },
    {
      name: 'Tahmid Muntaser',
      role: 'Frontend Developer | Database Developer',
      description: 'Crafting intuitive user interfaces and designing efficient database architectures.',
      image: '/images/team/tahmid.jpeg',
      skills: ['React', 'Tailwind', 'MongoDB', 'MySQL'],
      github: 'https://github.com/TahmidMuntaser',
      linkedin: 'https://www.linkedin.com/in/tahmid-muntaser-518929230',
      email: 'tahmid25muntaser@gmail.com',
      website: 'https://tahmidmuntaser.vercel.app'
    },
    {
      name: 'Abdullah Al Noman',
      role: 'Backend Developer | AI Developer',
      description: 'Building robust backend systems and integrating AI solutions for intelligent automation.',
      image: '/images/team/noman.jpg',
      skills: ['Node.js', 'AI/ML', 'Python', 'APIs'],
      github: 'https://github.com/NightFury-9b71',
      linkedin: 'https://www.linkedin.com/in/nomanstine',
      email: 'nomanstine@gmail.com',
      website: 'https://www.nomanstine.engineer'
    },
    {
      name: 'Puspita Sarker',
      role: 'Frontend Developer | AI Developer',
      description: 'Creating engaging user experiences and implementing AI-powered features.',
      image: '/images/team/puspita.jpg',
      skills: ['React', 'JavaScript', 'AI/ML', 'UI/UX'],
      github: 'https://github.com/PuspitaSRA',
      linkedin: 'https://www.linkedin.com/in/puspita-sarker',
      email: 'puspitasarker30@gmail.com',
      website: '#'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-r from-[#002029] via-[#00303d] to-[#004052]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4 rounded-xl" />
            <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#003d4d]/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30">
                <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2 rounded" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4 rounded" />
                <Skeleton className="h-20 w-full mb-4 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full rounded" />
                  <Skeleton className="h-6 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-[#002029] via-[#00303d] to-[#004052] text-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-400/30 mb-6 shadow-lg shadow-blue-500/20">
            <Users size={20} className="text-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold text-cyan-300">Meet Our Team</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-white">The Minds Behind</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500">
              AutoCP
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the talented developers who brought this AI-powered competitive programming platform to life
          </p>
        </div>

        {/* Developer Cards - 4 columns on large screens, responsive on smaller screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="group relative animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              
              <div className="relative bg-[#003d4d]/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 h-full flex flex-col">
                {/* Profile Image */}
                <div className="mb-6 relative">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/30">
                    <img 
                      src={dev.image} 
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-600 to-cyan-600 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    <Sparkles size={12} className="inline mr-1" />
                    Developer
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {dev.name}
                  </h3>
                  <p className="text-sm text-cyan-400 font-semibold">
                    {dev.role}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 text-center mb-6 grow">
                  {dev.description}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {dev.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium text-blue-300 border border-blue-400/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 pt-4 border-t border-cyan-500/20">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 group/icon"
                    title="GitHub"
                  >
                    <Github size={18} className="text-gray-300 group-hover/icon:text-cyan-400 transition-colors" />
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 group/icon"
                    title="LinkedIn"
                  >
                    <Linkedin size={18} className="text-gray-300 group-hover/icon:text-cyan-400 transition-colors" />
                  </a>
                  <a
                    href={`mailto:${dev.email}`}
                    className="p-2 bg-white/10 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 group/icon"
                    title="Email"
                  >
                    <Mail size={18} className="text-gray-300 group-hover/icon:text-cyan-400 transition-colors" />
                  </a>
                  <a
                    href={dev.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 group/icon"
                    title="Website"
                  >
                    <Globe size={18} className="text-gray-300 group-hover/icon:text-cyan-400 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;
