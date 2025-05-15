import React, {useEffect} from 'react'
import './App.css'
import Home from './pages/Home'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import GenerateVideo from './pages/GenerateVideo'
import MyMedia from './pages/MyMedia'
import { Video, FolderOpen, User } from 'lucide-react'
import useStore from './store/store'

const Dock = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-4 py-3 flex items-center justify-center gap-6 z-50 shadow-lg min-w-48">
      <Link to="/generate" className={`flex flex-col items-center ${location.pathname === '/generate' ? 'text-blue-400' : 'text-gray-200'}`}>
        <div className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
          <Video size={28} strokeWidth={2} />
        </div>
      </Link>
      
      <Link to="/mymedia" className={`flex flex-col items-center ${location.pathname === '/mymedia' ? 'text-blue-400' : 'text-gray-200'}`}>
        <div className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
          <FolderOpen size={28} strokeWidth={2} />
        </div>
      </Link>
      
      <div className="flex flex-col items-center text-gray-200">
        <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-700/50 transition-colors">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: '28px',
                  height: '28px'
                },
                userButtonTrigger: {
                  width: '28px',
                  height: '28px'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const App = () => {

  const { isSignedIn, user } = useUser();
  const {createUserInDB} = useStore();
  
  useEffect(() => {
    if(isSignedIn && user){
      createUserInDB(user.id,user.primaryEmailAddress,user.firstName,user.lastName,user.imageUrl);
    }
  }, [isSignedIn, user]);

  return (
    <BrowserRouter>
      <div className='min-h-screen h-full bg-gray-900 text-white'>
        <SignedOut>
          <Home />
        </SignedOut>
        <SignedIn>
          <main className="h-full pb-24">
            <Routes>
              <Route path="/" element={<Navigate to="/generate" replace />} />
              <Route path="/generate" element={<GenerateVideo />} />
              <Route path="/mymedia" element={<MyMedia />} />
            </Routes>
          </main>
          
          <Dock />
        </SignedIn>
      </div>
    </BrowserRouter>
  )
}

export default App