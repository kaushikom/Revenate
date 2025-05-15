import React, { useState, useEffect } from 'react'
import BackgroundVideo from '../assets/bg.mp4'
import { useAuth, SignInButton } from '@clerk/clerk-react'

const Home = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const { isSignedIn } = useAuth();

  // Handle video load event
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  const handleGenerateClick = () => {
    if (isSignedIn) {
      // Add your video generation logic here
      console.log("Generating product video...");
    }
    // If not signed in, the SignInButton component will handle the sign-in flow
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          className="absolute w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoaded}
        >
          {/* Replace this with your actual video source */}
          <source src={BackgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay to improve text visibility */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full w-[90%] md:w-4/5 mx-auto overflow-y-hidden text-white">
        <h1 className="font-bold lexend-tera text-center text-5xl md:text-8xl uppercase mt-24 md:mt-36">Revenate</h1>
        <p className="dm-serif text-center text-3xl mt-8 md:text-6xl md:mt-12">From Static to Stunning.</p>
        <p className="text-center dm-sans mt-8 text-xl md:text-3xl md:mt-12">
          Turn product shots into motion magic with AI-generated videos that boost engagement and conversions.
        </p>
        <div className="flex justify-center mt-8 md:mt-12">
          {/* <button className="mx-auto text-center text-white bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded-md text-2xl">
            Generate Product Video
          </button> */}
          <SignInButton mode="modal">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Generate Product Video
          </button>
        </SignInButton>
        </div>
      </div>
    </div>
  )
}

export default Home