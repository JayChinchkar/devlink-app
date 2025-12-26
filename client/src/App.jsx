import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // <--- THIS LINE MUST BE HERE

function App() {
  const { token } = useContext(AuthContext);

  // If token has a value, show Dashboard. If it is null, show Login.
  if (token) {
    return <Dashboard />;
  } else {
    return <Login />;
  }
}

export default App;