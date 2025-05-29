import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signup.css';

const governorates = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba",
  "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana",
  "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
];

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Step 2
    cin: '',
    professionalId: '',
    fiscalId: '',
    city: '',
    postalCode: '',
    governorate: '',
    
    // Step 3
    shopName: '',
    shopAddress: '',
    shopImages: []
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    if (files.length > 0) {
      const newImagePreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newImagePreviews);
      setFormData({
        ...formData,
        shopImages: files
      });
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.lastName) newErrors.lastName = 'Ce champ est obligatoire.';
      else if (formData.lastName.length < 4) newErrors.lastName = 'Le nom doit contenir au moins 4 caractères.';
      
      if (!formData.firstName) newErrors.firstName = 'Ce champ est obligatoire.';
      else if (formData.firstName.length < 4) newErrors.firstName = 'Le prénom doit contenir au moins 4 caractères.';
      
      if (!formData.email) newErrors.email = 'Ce champ est obligatoire.';
      else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) newErrors.email = 'Veuillez entrer une adresse Gmail valide.';
      
      if (!formData.password) newErrors.password = 'Ce champ est obligatoire.';
      else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.';
      }
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Ce champ est obligatoire.';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      
      if (!formData.phone) newErrors.phone = 'Ce champ est obligatoire.';
    }
    
    if (stepNumber === 2) {
      if (!formData.cin) newErrors.cin = 'Ce champ est obligatoire.';
      else if (!/^\d{8}$/.test(formData.cin)) newErrors.cin = 'Le num de CIN doit contenir exactement 8 chiffres.';
      
      if (!formData.professionalId) newErrors.professionalId = 'Ce champ est obligatoire.';
      else if (!/^\d{4}$/.test(formData.professionalId)) newErrors.professionalId = 'Le matricule professionnel doit contenir exactement 4 chiffres.';
      
      if (!formData.fiscalId) newErrors.fiscalId = 'Ce champ est obligatoire.';
      else if (!/^\d{4}$/.test(formData.fiscalId)) newErrors.fiscalId = 'Le matricule fiscal doit contenir exactement 4 chiffres.';
      
      if (!formData.city) newErrors.city = 'Ce champ est obligatoire.';
      else if (formData.city.length < 4) newErrors.city = 'La ville doit contenir au moins 4 caractères.';
      
      if (!formData.postalCode) newErrors.postalCode = 'Ce champ est obligatoire.';
      else if (!/^\d{4}$/.test(formData.postalCode)) newErrors.postalCode = 'Le code postal doit contenir exactement 4 chiffres.';
      
      if (!formData.governorate) newErrors.governorate = 'Ce champ est obligatoire.';
    }
    
    if (stepNumber === 3) {
      if (!formData.shopName) newErrors.shopName = 'Ce champ est obligatoire.';
      if (!formData.shopAddress) newErrors.shopAddress = 'Ce champ est obligatoire.';
      if (formData.shopImages.length === 0) newErrors.shopImages = 'Veuillez télécharger au moins une image.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      // Handle form submission
      console.log('Form submitted', formData);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Inscription</h2>
        
        <div className="progress-bar">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="lastName">Nom :</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Veuillez entrer votre nom"
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="firstName">Prénom :</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Veuillez entrer votre prénom"
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Adresse e-mail :</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Veuillez entrer votre adresse e-mail"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Mot de passe :</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Veuillez entrer un mot de passe"
                />
                {errors.password && <span className="error">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Veuillez confirmer votre mot de passe"
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Téléphone :</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Veuillez entrer votre numéro de téléphone"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              
              <div className="form-actions">
                <button type="button" className="next-button" onClick={nextStep}>Suivant</button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="cin">CIN :</label>
                <input
                  type="text"
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="Veuillez entrer votre numéro de CIN "
                  maxLength="8"
                />
                {errors.cin && <span className="error">{errors.cin}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="professionalId">Matricule professionnel :</label>
                <input
                  type="text"
                  id="professionalId"
                  name="professionalId"
                  value={formData.professionalId}
                  onChange={handleChange}
                  placeholder="Veuillez entrer votre matricule professionnel"
                  maxLength="4"
                />
                {errors.professionalId && <span className="error">{errors.professionalId}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="fiscalId">Matricule fiscal :</label>
                <input
                  type="text"
                  id="fiscalId"
                  name="fiscalId"
                  value={formData.fiscalId}
                  onChange={handleChange}
                  placeholder="Veuillez entrer votre matricule fiscal "
                  maxLength="4"
                />
                {errors.fiscalId && <span className="error">{errors.fiscalId}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="city">Ville :</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Veuillez entrer une ville"
                />
                {errors.city && <span className="error">{errors.city}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode">Code postal :</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Veuillez entrer un code postal"
                  maxLength="4"
                />
                {errors.postalCode && <span className="error">{errors.postalCode}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="governorate">Gouvernorat :</label>
                <select
                  id="governorate"
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez un gouvernorat</option>
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
                {errors.governorate && <span className="error">{errors.governorate}</span>}
              </div>
              
              <div className="form-actions double-buttons">
                <button type="button" className="prev-button" onClick={prevStep}>Précédent</button>
                <button type="button" className="next-button" onClick={nextStep}>Suivant</button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="form-step">
              <div className="form-group">
                <label htmlFor="shopName">Nom de la boutique :</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Veuillez entrer le nom de votre boutique"
                />
                {errors.shopName && <span className="error">{errors.shopName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="shopAddress">Adresse de la boutique :</label>
                <input
                  type="text"
                  id="shopAddress"
                  name="shopAddress"
                  value={formData.shopAddress}
                  onChange={handleChange}
                  placeholder="Veuillez entrer l'adresse de votre boutique"
                />
                {errors.shopAddress && <span className="error">{errors.shopAddress}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="shopImages">Images de la boutique :</label>
                <input
                  type="file"
                  id="shopImages"
                  name="shopImages"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                />
                {errors.shopImages && <span className="error">{errors.shopImages}</span>}
                
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index}`} className="preview-image" />
                  ))}
                </div>
              </div>
              
              <div className="form-actions double-buttons">
                <button type="button" className="prev-button" onClick={prevStep}>Précédent</button>
                <button type="submit" className="submit-button">S'inscrire</button>
              </div>
            </div>
          )}
        </form>
        
        <div className="login-link">
          Vous avez déjà un compte ? <Link to="/signin">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;