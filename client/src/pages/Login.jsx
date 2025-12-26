import React from 'react';
import { Github, Layout, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  // Use the Environment Variable for the API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleLogin = () => {
    // Redirect to the live Backend Auth Route
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white relative overflow-hidden p-6">
      
      {/* Animated Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full -z-10" 
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full -z-10" 
      />

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl shadow-blue-600/40">
            <Layout size={48} className="text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black tracking-tighter italic bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            DEVLINK
          </h1>
          <p className="text-slate-400 font-medium text-lg">
            The professional feed for builders.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 py-8">
          <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-left">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><Globe size={20} /></div>
            <div>
              <p className="text-sm font-bold">Discover Repos</p>
              <p className="text-xs text-slate-500">Find what the community is building.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-left">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400"><Zap size={20} /></div>
            <div>
              <p className="text-sm font-bold">Showcase Work</p>
              <p className="text-xs text-slate-500">Share your GitHub projects instantly.</p>
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-[2rem] font-black text-lg hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
        >
          <Github size={24} />
          Continue with GitHub
        </motion.button>

        <p className="text-slate-600 text-xs uppercase tracking-[0.2em] font-bold pt-4">
          Secure Authentication via GitHub OAuth
        </p>
      </motion.div>
    </div>
  );
};

export default Login;