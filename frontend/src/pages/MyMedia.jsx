import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import useStore from '../store/store';



const MyMedia = () => {
  const { isSignedIn, user } = useUser();
  const { getMediaByUser, media } = useStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isSignedIn && user) {
      getMediaByUser(user.id);
    }
  }, [isSignedIn, user, getMediaByUser]);

  const filteredMedia = media?.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = searchTerm === '' || 
      (item.originalFilename && item.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  }) || [];

  const imageCount = media?.filter(item => item.type === 'image').length || 0;
  const videoCount = media?.filter(item => item.type === 'video').length || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">My Media</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-2 top-2.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex border border-gray-300 rounded-lg">
            <button
              className={`px-4 py-2 text-sm rounded-l-lg ${activeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({(media?.length || 0)})
            </button>
            <button
              className={`px-4 py-2 text-sm border-l border-gray-300 ${activeFilter === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}
              onClick={() => setActiveFilter('image')}
            >
              Images ({imageCount})
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-r-lg border-l border-gray-300 ${activeFilter === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}
              onClick={() => setActiveFilter('video')}
            >
              Videos ({videoCount})
            </button>
          </div>
        </div>
      </div>

      {!media || media.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No media found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {isSignedIn ? "Upload media to see it here." : "Sign in to view your media."}
          </p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No media matches your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <MediaCard key={item._id || item.cloudinaryPublicId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const MediaCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatFileSize = (width, height) => {
    if (!width || !height) return '';
    return `${width} × ${height}`;
  };
  
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getThumbnailUrl = (url) => {
    // Transform Cloudinary URL to get video thumbnail
    if (item.type === 'video') {
      // return url.replace('/upload/', '/upload/w_600,h_400,c_fill/').replace(/\.[^.]+$/, '.jpg');
      return item.thumbnailUrl
    }
    return url;
  };

  const handleCardClick = (e) => {
    // Prevent opening when clicking video controls
    if (!e.target.closest('video, button, input, select, textarea')) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div 
    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={handleCardClick}
  >
    <div className="relative aspect-video bg-gray-200 overflow-hidden">
      {item.type === "image" ? (
        <img 
        src={item.thumbnailUrl || item.url} 
        alt={item.originalFilename || "Image"} 
        className="w-full h-full object-cover"
      />
      ) : (
        <div className="relative w-full h-full">
          <video 
            src={item.url} 
            className="w-full h-full object-cover" 
            controls={isHovered}
            poster={item.thumbnailUrl || item.url}
          />
            {!isHovered && item.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(item.duration)}
              </div>
            )}
          </div>
        )}
        <div className={`absolute inset-0 bg-black bg-opacity-0 ${isHovered ? 'bg-opacity-10' : ''} transition-opacity duration-200`}></div>
      </div>
      <div className="p-3">
      <p className="text-sm font-medium text-gray-800 truncate" title={item.createdAt}>
  {new Date(item.createdAt).toLocaleString()}
</p>
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            {formatDate(item.createdAt)}
          </p>
          <p className="text-xs text-gray-500">
            {item.type === "image" ? formatFileSize(item.width, item.height) : formatDuration(item.duration)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyMedia;