import { Github } from 'lucide-react';

const Login = () => {
  const handleLogin = () => {
    // Redirect to our Backend Auth Route
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-8">DevLink</h1>
      <p className="text-gray-400 mb-10 text-xl">The professional network for builders.</p>
      
      <button 
        onClick={handleLogin}
        className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105"
      >
        <Github size={24} />
        Login with GitHub
      </button>
    </div>
  );
};

export default Login;