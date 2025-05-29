import React from 'react';
import { Link } from 'react-router-dom';
import sidebarImage from './me.png';
import contactImage from './contact-us.jpg';
import opti1Image from './opti1.png'; 
import opti2Image from './opticien2.png'; 

const Accueil = () => {
  // Smooth scrolling effect
  React.useEffect(() => {
    const smoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', smoothScroll);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', smoothScroll);
      });
    };
  }, []);

  return (
    <div>
      {/* Header/Navigation */}
      <header>
        <div className="header-container">
          <div className="logo">OptiMate</div>
          <nav>
            <ul>
              <li><a href="#accueil">Accueil</a></li>
              <li><a href="#apropos">À propos</a></li>
              <li><a href="#mission">Services</a></li>
              <li><a href="#contact">Contact</a></li>
              <li className="nav-button-item">
                <Link to="/signin" className="nav-button login-button">Connexion</Link>
              </li>
              <li className="nav-button-item">
                <Link to="/signup" className="nav-button signup-button">Inscription</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Home Section */}
      <section id="accueil">
        <div className="content-left">
          <div className="hero">
            <h1>Bienvenue sur OptiMate</h1>
            <p>OptiMate est une solution web innovante qui centralise les fonctionnalités essentielles pour une gestion optimisée des activités en optique.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p>De la gestion des stocks à l’organisation des rendez-vous en passant par le suivi administratif, tout est réuni dans une interface claire et performante.</p>


            <a href="#apropos" className="cta-button">LIRE LA SUITE</a>
          </div>
        </div>
        <div className="sidebar-right">
          <img src={sidebarImage} alt="OptiMate illustration" className="sidebar-image" />
        </div>
      </section>

      {/* About Section */}
              <section id="apropos">
        <div className="apropos-container">
          <h2 className="section-title">À PROPOS DE NOUS</h2>
          <div className="apropos-content">
            <div className="apropos-text">
              <h3>Votre partenaire pour la digitalisation de l’optique</h3>
              <p>OptiMate est une solution complète dédiée aux opticiens pour gérer efficacement leur activité. Notre plateforme intègre tous les outils nécessaires pour faciliter votre travail au quotidien.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p>De la gestion des stocks de verres et montures à la prise de rendez-vous en ligne, en passant par le suivi des prescriptions médicales, nous couvrons tous les aspects de votre métier.</p>

              <a href="#mission" className="cta-button" style={{ marginTop: '30px' }}>LIRE LA SUITE</a>
            </div>
            <div className="apropos-images">
                <div className="circle-image-container">
                  <img src={opti1Image} alt="Doctor" className="circle-image" />
                </div>
                <div className="circle-image-container">
                  <img src={opti2Image} alt="doctor" className="circle-image" />
                </div>
              </div>
            </div>
          </div>
        </section>
      {/* Products Section */}
      <section id="mission">
        <div className="mission-container">
          <h2 className="section-title">NOS SOLUTIONS POUR OPTICIENS</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-image" style={{ backgroundImage: 'url()' }}></div>
              <div className="mission-content">
                <h3>Gestion simplifiée des tâches</h3>
                <p>Optimisez votre quotidien avec un tableau de bord clair et intuitif. Suivez vos rendez-vous, commandes et clients en un coup d'œil.</p>
              </div>
            </div>
            <div className="mission-card">
              <div className="mission-image" style={{ backgroundImage: 'url()' }}></div>
              <div className="mission-content">
                <h3>Planning intelligent des rendez-vous</h3>
                <p>Planifiez facilement vos consultations et gérez vos disponibilités. Vos clients reçoivent des rappels automatiques pour réduire les absences.</p>
              </div>
            </div>
            <div className="mission-card">
              <div className="mission-image" style={{ backgroundImage: 'url()' }}></div>
              <div className="mission-content">
                <h3>Votre boutique toujours connectée</h3>
                <p>Proposez des offres, gérez vos achats et suivez vos ventes en temps réel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section  */}
        <section id="contact">
          <div className="contact-container">
            <h2 className="section-title">Contactez-nous</h2>
            <div className="contact-content">
              <div className="contact-info">
                <p>Pour toute demande d'information, n'hésitez pas à nous contacter directement via les coordonnées ci-dessous.</p>
                <div className="contact-details">
                  <div className="contact-item">
                    <h4>À PROPOS D'OPTIMATE</h4>
                    <p>Solutions digitales pour opticiens</p>
                    <p>Gestion de stock & relation client</p>
                  </div>
                  <div className="contact-item">
                    <h4>TÉLÉPHONE</h4>
                    <p>+216 71 234 567</p>
                    <p>+216 98 765 432</p>
                  </div>
                  <div className="contact-item">
                    <h4>ADRESSE</h4>
                    <p> Centre Urbain Nord, Tunis</p>
                  </div>
                </div>
              </div>
              <div className="contact-image-container">
                <img src={contactImage} alt="Contact illustration" className="contact-image" />
              </div>
            </div>
          </div>
        </section>

      {/* Footer - Keep original */}
      <footer>
        <div className="footer-content">
          <p className="footer-text">&copy; {new Date().getFullYear()} OptiMate. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="/mentions-legales">Mentions légales</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          line-height: 1.6;
          color: #333;
          overflow-x: hidden;
        }
        
        /* Header Styles */
        header {
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
        }
        
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 5%;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }
        
        nav ul {
          display: flex;
          list-style: none;
          gap: 30px;
          align-items: center;
        }
        
        nav a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.3s;
        }
        
       
        
        .nav-button {
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: 500;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        
        .login-button {
          background-color: transparent;
          color: #2a7fba;
          border: 1px solid #2a7fba;
        }
        
        .login-button:hover {
          background-color: #2a7fba;
          color: white;
        }
        
        .signup-button {
          background-color: #2a7fba;
          color: white;
        }
        
        

        /* Reduced space between Sign In and Sign Up buttons */
        .nav-button-item {
          margin-right: -15px;
        }

        .nav-button-item:last-child {
          margin-right: 0;
        }
        
        /* Main Content Sections */
        section {
          padding: 120px 10% 80px;
          min-height: 100vh;
        }
        
        /* Home Section - Modified to remove white container */
        #accueil {
          display: flex;
          padding-top: 180px;
          margin: 0 auto;
          background-color: #fff;
        
        }
        
        .content-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 5%;
          margin-top:10px;
          margin-bottom:200px;
        }
        
        .sidebar-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none; 
        }
        
        .sidebar-image {
          width: 100%;
          height: auto;
          max-height: 80vh;
          object-fit: contain;
          margin-right:0px;
          margin-left: 180px;
          margin-top:10px;
          margin-bottom:200px;
        }
        
        .hero h1 {
          font-size: 2.7rem;
          margin-bottom: 20px;
          color: #333;
          
        }
        
        .hero p {
          margin-bottom: 30px;
          max-width: 600px;
          color: #555;
          font-size: 1.1rem;
          line-height: 1.7;
        }
        
        .cta-button {
          display: inline-block;
          background-color: #2a7fba;
          color: white;
          padding: 15px 40px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
          box-shadow: 0 5px 15px rgba(42, 127, 186, 0.3);
          margin-top: 20px;
          margin-left: auto;
          margin-right: auto;
          display: inline-block;
          width: fit-content; 
        }
        
        .cta-button:hover {
          background-color: #1e6da1;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(42, 127, 186, 0.4);
        }
        
        /* About Section  */
        .apropos-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 3.5rem;
          color: #2a7fba;
          text-align: center;
          position: relative;
          font-weight: 700;
        }

        .section-title::after {
          content: '';
          display: block;
          width: 80px;
          height: 4px;
          background-color: #2a7fba;
          margin: 1.5rem auto 0;
        }

        .apropos-content {
          display: flex;
          gap: 3rem;
          align-items: center;
        }

        .apropos-text {
          flex: 1;
        }

        .apropos-text h3 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #333;
          font-weight: 600;
          line-height: 1.3;
        }

        .apropos-text p {
          margin-bottom: 1.5rem;
          color: #555;
          font-size: 1.1rem;
          line-height: 1.7;
        }
        
        .apropos-images {
          flex: 1;
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        
        .circle-image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          background-color:rgba(243, 147, 38, 0.94);
        }

        /* Products Section  */
        #mission {
          background-color: #fff;
          padding: 80px 10%;
        }

        .mission-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .mission-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .mission-card:hover {
          transform: translateY(-10px);
        }

        .mission-image {
          height: 250px;
          background-size: cover;
          background-position: center;
        }

        .mission-content {
          padding: 25px;
        }

        .mission-content h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #2a7fba;
          text-align:center;
        }

        .mission-content p {
          color: #555;
          margin-bottom: 20px;
          text-align: left;
          line-height: 1.6; /* Ajuste cette valeur selon ton rendu */
        }

        
        /* Contact Section - Keep original */
        #contact {
          background-color: #fff;
        }
        
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .contact-content {
          display: flex;
          gap: 60px;
        }
        
        .contact-info {
          flex: 1;
        }
        
        .contact-details {
          margin-top: 40px;
        }
        
        .contact-item {
          margin-bottom: 30px;
        }
        
        .contact-item h4 {
          font-size: 1.2rem;
          color: #2a7fba;
          margin-bottom: 10px;
        }
        
        .contact-image {
          flex: 1;
         
           width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 15px;
        }
        
        /* Footer - Keep original */
        footer {
          background-color: #2a7fba;
          color: white;
          padding: 30px 5%;
          text-align: center;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-text {
          font-size: 0.9rem;
        }

        .footer-links a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
          transition: opacity 0.3s;
        }

        .footer-links a:hover {
          opacity: 0.8;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          #accueil {
            flex-direction: column;
            padding-top: 120px;
          }
          
          .content-left {
            padding-right: 0;
            margin-bottom: 40px;
            align-items: center;
            text-align: center;
          }
          
          .sidebar-right {
            min-height: 400px;
          }
          
          .apropos-content {
            flex-direction: column;
          }
          
          .contact-content {
            flex-direction: column;
          }
          
          .contact-image {
            min-height: 300px;
          }

          .mission-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 20px;
          }
          
          nav ul {
            flex-direction: column;
            gap: 15px;
          }
          
          .nav-button {
            display: block;
            text-align: center;
          }
          
          .hero h1 {
            font-size: 2.2rem;
          }
          
          .apropos-images {
            flex-direction: column;
            align-items: center;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 20px;
          }
          
          .footer-links a {
            margin: 0 10px;
          }

          .nav-button-item {
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Accueil;