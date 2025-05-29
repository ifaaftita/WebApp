import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './signin.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Ce champ est obligatoire.';
    } else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|admin\.com|opticien\.com)$/.test(email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide.';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Ce champ est obligatoire.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (validateForm()) {
      try {
        const user = login(email, password);
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/opticien');
        }
      } catch (error) {
        setLoginError('Email ou mot de passe incorrect');
      }
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>Connexion</h2>
        {loginError && <div className="login-error">{loginError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Adresse e-mail :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@gmail.com"
              className={errors.email ? 'error-input' : ''}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Se souvenir de moi</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Mot de passe oublié ?</Link>
          </div>
          
          <button type="submit" className="signin-button">Se connecter</button>
          
          <div className="signup-link">
            Vous n'avez pas de compte ? <Link to="/signup">S'inscrire</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;