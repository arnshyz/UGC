import React from 'react';
import DashboardIcon from './icons/DashboardIcon';
import UgcToolIcon from './icons/UgcToolIcon';
import VideoIcon from './icons/VideoIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle }) => {
  // A static sidebar for the new UI design
  const navItems = [
    { name: 'Dashboard', icon: DashboardIcon },
    { name: 'UGC Tool', icon: UgcToolIcon, active: true },
    { name: 'Voice Over Tool', icon: () => <span className="w-5 h-5">🎙️</span> },
    { name: 'Video Generator', icon: VideoIcon },
    { name: 'Lipsync Studio', icon: () => <span className="w-5 h-5">🎵</span> },
    { name: 'Image Editing', icon: () => <span className="w-5 h-5">🖼️</span> },
    { name: 'Script Generator', icon: () => <span className="w-5 h-5">✍️</span> },
    { name: 'Filmmaker', icon: () => <span className="w-5 h-5">🎬</span> },
    { name: 'Settings', icon: () => <span className="w-5 h-5">⚙️</span> },
  ];

  return (
    <aside className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 w-full md:w-${isExpanded ? '64' : '20'}`}>
      <div className={`h-16 flex items-center border-b border-gray-200 ${isExpanded ? 'justify-center' : 'justify-center'}`}>
        <h1 className={`text-2xl font-bold text-gray-900 overflow-hidden ${isExpanded ? 'block' : 'hidden md:block'}`}>
           {isExpanded ? 'bikin sendiri' : <span className="text-purple-600 font-bold">b</span>}
        </h1>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href="#"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                item.active
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              } ${!isExpanded ? 'justify-center' : ''}`}
            >
              <Icon className={`w-5 h-5 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
              <span className={isExpanded ? 'block' : 'hidden'}>{item.name}</span>
            </a>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200 hidden md:block">
          <button 
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-md"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <ChevronLeftIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
