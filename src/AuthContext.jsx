import { createContext, useState, useRef, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const timeoutRef = useRef(null);
  const SIGNOUT_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      console.log('Session timed out due to inactivity');
      logout();
    }, SIGNOUT_TIMEOUT);
  };

  const login = (email, password, id, role) => {
    const userData = {
      email,
      password: password,
      id: id,
      role: role
    };

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    resetTimeout(); // Start timeout on login
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Vérifie si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      resetTimeout(); // Resume timeout on page refresh
    }

    // Optional: Reset timer on user activity
    const events = ['click', 'keypress', 'mousemove'];
    events.forEach(event =>
      window.addEventListener(event, resetTimeout)
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event =>
        window.removeEventListener(event, resetTimeout)
      );
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};