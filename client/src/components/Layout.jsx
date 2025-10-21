import Navbar from './Navbar'; 
import { Toaster } from 'react-hot-toast'; 

export default function Layout({ children }) {
  return (
    // Task 1.1: Removed bg-gray-100 to allow global background theme to apply
    <div className="min-h-screen">
      {/* Toaster for global notifications */}
      <Toaster position="top-right" />

      <Navbar /> 

      {/* Task 1.2: Redundant header element containing the title has been removed */}
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}