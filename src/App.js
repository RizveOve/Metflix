import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("netflixUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (email) => {
    const userData = { email, loginTime: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem("netflixUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("netflixUser");
  };

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route
              path="/"
              element={<HomeScreen user={user} onLogout={handleLogout} />}
            />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
