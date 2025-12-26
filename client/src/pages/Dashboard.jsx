import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle, Star, Code, LogOut, Trash2, ExternalLink, Heart, Search, Layout, TrendingUp, User, Zap } from 'lucide-react';

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [repoUrl, setRepoUrl] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(res.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    if (token) fetchProjects();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Syncing with GitHub...');
    try {
      const res = await axios.post('http://localhost:5000/api/projects', { repoUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects([res.data, ...projects]);
      setRepoUrl('');
      toast.success('Project Posted Successfully!', { id: loadingToast });
    } catch (err) {
      toast.error('Could not find that repository.', { id: loadingToast });
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/projects/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.map(p => p._id === id ? res.data : p));
      toast('Upvoted!', { icon: '💖', style: { background: '#db2777', color: '#fff' } });
    } catch (err) { console.error(err); }
  };

  const deleteProject = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-sm">Permanently delete this project?</p>
        <div className="flex gap-2">
          <button 
            onClick={() => { confirmDelete(id); toast.dismiss(t.id); }}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-all"
          >
            Yes, Delete
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  const confirmDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Authorized owners only.');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.language?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStars = projects.reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const topProjects = [...projects].sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 overflow-x-hidden">
      {/* Large Central Toaster */}
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { fontSize: '1.1rem', minWidth: '350px' } }} />

      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full -z-10" 
      />

      <div className="max-w-[1400px] mx-auto">
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-10 bg-slate-900/50 backdrop-blur-2xl p-6 rounded-[2rem] border border-slate-800/50 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl"><Layout size={24} className="text-white" /></div>
            <h1 className="text-2xl font-black tracking-widest italic">DEVLINK</h1>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={logout} className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={20} />
          </motion.button>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <motion.aside initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 text-center backdrop-blur-md">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 p-1 mb-6">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <User size={40} className="text-slate-600" />
                </div>
              </div>
              <h2 className="font-bold text-xl text-white">Community Dev</h2>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                  <p className="text-blue-400 font-black text-2xl">{projects.length}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Posts</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                  <p className="text-yellow-400 font-black text-2xl">{totalStars > 1000 ? (totalStars/1000).toFixed(1) + 'k' : totalStars}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Reach</p>
                </div>
              </div>
            </div>
          </motion.aside>

          <main className="lg:col-span-6 space-y-10">
            <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={handleSubmit} className="flex gap-4">
              <input 
                type="url" 
                placeholder="Paste GitHub link here..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="flex-1 bg-slate-900/50 border border-slate-800 rounded-[1.5rem] px-8 py-5 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg shadow-inner"
              />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="bg-blue-600 px-8 rounded-[1.5rem] font-bold shadow-xl shadow-blue-600/20"><PlusCircle size={28} /></motion.button>
            </motion.form>

            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/30 border border-slate-800/50 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-blue-500/50 transition-all shadow-lg"
              />
            </div>

            <div className="space-y-8">
              <AnimatePresence mode='popLayout'>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <img src={project.postedByAvatar} className="w-10 h-10 rounded-full ring-2 ring-slate-800 shadow-xl" alt="" />
                        <div>
                          <p className="text-sm font-black text-blue-500 leading-none">@{project.postedByUsername}</p>
                          <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase">{new Date(project.createdAt).toDateString()}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteProject(project._id)} className="p-2 text-slate-700 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                    </div>

                    <h3 className="text-2xl font-black mb-3 text-white tracking-tight">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-loose">{project.description}</p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                      <div className="flex gap-4">
                        <motion.button 
                          whileTap={{ scale: 1.5 }}
                          onClick={() => handleUpvote(project._id)} 
                          className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-slate-950 border border-slate-800"
                        >
                          <Heart size={18} fill={project.upvotes?.length > 0 ? "#f43f5e" : "none"} className={project.upvotes?.length > 0 ? "text-rose-500" : "text-slate-600"} />
                          <span className="text-sm font-bold">{project.upvotes?.length || 0}</span>
                        </motion.button>
                        <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-yellow-500/5 text-yellow-500 border border-yellow-500/10 font-bold text-sm">
                          <Star size={16} /> {project.stars?.toLocaleString()}
                        </div>
                      </div>
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" className="bg-blue-500/10 p-3 rounded-2xl text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg"><ExternalLink size={20} /></a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </main>

          <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp size={24} className="text-purple-500" />
                <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-500">Hall of Fame</h3>
              </div>
              <div className="space-y-8">
                {topProjects.map((p, i) => (
                  <div key={p._id} className="flex items-center gap-5">
                    <span className="text-3xl font-black text-slate-800">0{i+1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-200 truncate">{p.title}</p>
                      <p className="text-[10px] text-blue-500 font-black mt-1 uppercase">{p.upvotes?.length || 0} Votes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;