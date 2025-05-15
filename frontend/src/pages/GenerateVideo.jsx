import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import useStore from '../store/store';

const GenerateVideo = () => {
  const { isSignedIn, user } = useUser();
  const uploadMedia = useStore((state) => state.uploadMedia);

  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setVideoUrl('');
    }
  };

  const handleGenerate = async () => {
    if (!file || !isSignedIn) return;
    setProcessing(true);
    try {
      const media = await uploadMedia(file, user.id);
      if (media?.url) {
        setVideoUrl(media.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  const isImage = file?.type?.startsWith('image');
  const isVideo = file?.type?.startsWith('video');

  return (
    <div>
<h1 className='text-bold text-4xl dm-sans text-center pt-8'>Generate Video</h1>
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-10 md:flex-row md:items-start">
      
      {/* Left Panel: Upload & Button */}
      <div className="flex flex-col items-center gap-4">
        <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 w-60 text-center">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="cursor-pointer text-sm w-full"
          />
          {file && <p className="mt-2 text-xs text-gray-300 truncate">Selected: {file.name}</p>}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!file || processing}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Generate Video'}
        </button>
      </div>

      {/* Right Panel: Side-by-side Previews */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Upload Preview */}
        <div className="w-[240px] aspect-[9/16] border rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
          {!file ? (
            <p className="text-gray-400 text-xs text-center">Upload preview</p>
          ) : isImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="object-cover w-full h-full"
            />
          ) : isVideo ? (
            <video
              src={URL.createObjectURL(file)}
              controls
              className="object-cover w-full h-full"
            />
          ) : (
            <p className="text-xs text-red-500">Unsupported file</p>
          )}
        </div>

        {/* Generated Video Preview */}
        <div className="w-[240px] aspect-[9/16] border rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
          {processing ? (
            <p className="text-sm text-gray-500">Processing...</p>
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="object-cover w-full h-full"
            />
          ) : (
            <p className="text-gray-400 text-xs text-center">No video yet</p>
          )}
        </div>
      </div>
    </div>
    
       {processing && <p className='text-center'>*Please don't switch page while the video is being generated</p>}
    </div>
  );
};

export default GenerateVideo;
