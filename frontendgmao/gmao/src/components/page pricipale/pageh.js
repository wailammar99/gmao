
import React, { useEffect,useState } from 'react';
import './pageh.scss'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import Contact from '../contactform';

import '@fortawesome/fontawesome-free/css/all.min.css'

import './pageh.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



const Header = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg']; // Add your image URLs here

  const handleNextClick = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevClick = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };


  return (
    <>
    <div className="nav">
    <div className="logo">
            {/* Utilisez src au lieu de href pour spécifier l'URL de l'image */}
            <img src="/logoo.png" alt="Logo" />
          </div>
        <ul>
            <li ><a href="#home"><i ></i>Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Fonctionnalite</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="#contact">Contact</a></li>

          </ul>
    </div>
      <header>
      <div className="main"></div>
      <div className="main"></div>
        <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={images[currentImage]}
            alt="Navigate"
            style={{ width: '1400px', height: '1000px', marginRight: '10px' }}
          />
          <Box className="button" position="absolute" top="50%" left="0" right="0" textAlign="center" mt={2}>
            <Button onClick={handlePrevClick} sx={{ textTransform: 'none', padding: '10px 20px', marginRight: '5px' }}>
              <ArrowForwardIosIcon />
            </Button>
            <Button onClick={handleNextClick} sx={{ textTransform: 'none', padding: '10px 20px', marginLeft: '5px' }}>
              <ArrowForwardIosIcon style={{ transform: 'rotate(180deg)' }} />
            </Button>
          </Box>
        </div>
        <div className="title" id="home">
          <h1>GMAO</h1>
          <h6>Maintenance Assistée Par Ordinateur</h6>
        </div>
      </header>
      <section id="features">
      <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-2">
                            <h6 className="title mb-4">Our Features</h6>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                        <div className="card service-wrapper rounded border-0 shadow p-4">
                            <div className="icon text-center text-custom h1 shadow rounded bg-white">
                                <span className="uim-svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em">
                                        <rect width="20" height="15" x="2" y="3" className="uim-tertiary" rx="3"></rect>
                                        <path className="uim-primary" d="M16,21H8a.99992.99992,0,0,1-.832-1.55469l4-6a1.03785,1.03785,0,0,1,1.66406,0l4,6A.99992.99992,0,0,1,16,21Z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="content mt-4">
                                <h5 className="title">Suivi des interventions et gestion des interventions</h5>
                                <p className="text-muted mt-3 mb-0">
                                    It is a long established fact that a reader will be distracted by the when looking at its layout.
                                </p>
                                <div className="mt-3">
                                    <a href="javascript:void(0)" className="text-custom">
                                        En savoir plus <i className="mdi mdi-chevron-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="big-icon h1 text-custom">
                                <span className="uim-svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em">
                                        <rect width="20" height="15" x="2" y="3" className="uim-tertiary" rx="3"></rect>
                                        <path className="uim-primary" d="M16,21H8a.99992.99992,0,0,1-.832-1.55469l4-6a1.03785,1.03785,0,0,1,1.66406,0l4,6A.99992.99992,0,0,1,16,21Z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
 
                    <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                        <div className="card service-wrapper rounded border-0 shadow p-4">
                            <div className="icon text-center text-custom h1 shadow rounded bg-white">
                                <span className="uim-svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" width="1em">
                                        <path className="uim-quaternary" d="M15,2c-3.3772,0.00142-6.27155,2.41462-6.88025,5.73651c2.90693-1.59074,6.553-0.52375,8.14374,2.38317c0.98206,1.79462,0.98206,3.96594,0,5.76057c3.8013-0.69634,6.31837-4.3424,5.62202-8.14369C21.27662,4.41261,18.37925,1.99872,15,2z"></path>
                                        <circle cx="7" cy="17" r="5" className="uim-primary"></circle>
                                        <path className="uim-tertiary" d="M11,7c-3.08339,0.00031-5.66461,2.33759-5.97,5.40582c2.5358-1.08949,5.47469,0.08297,6.56418,2.61877c0.54113,1.25947,0.54113,2.68593,0,3.94541c3.29729-0.32786,5.7045-3.26663,5.37664-6.56392C16.66569,9.33735,14.08386,6.99972,11,7z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="content mt-4">
                                <h5 className="title">Conversation entre utilisateurs</h5>
                                <p className="text-muted mt-3 mb-0">
                                    It is a long established fact that a reader will be distracted by the when looking at its layout.
                                </p>
                                <div className="mt-3">
                                    <a href="javascript:void(0)" className="text-custom">
                                        En savoir plus <i className="mdi mdi-chevron-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="big-icon h1 text-custom">
                                <span className="uim-svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" width="1em">
                                        <path className="uim-quaternary" d="M15,2c-3.3772,0.00142-6.27155,2.41462-6.88025,5.73651c2.90693-1.59074,6.553-0.52375,8.14374,2.38317c0.98206,1.79462,0.98206,3.96594,0,5.76057c3.8013-0.69634,6.31837-4.3424,5.62202-8.14369C21.27662,4.41261,18.37925,1.99872,15,2z"></path>
                                        <circle cx="7" cy="17" r="5" className="uim-primary"></circle>
                                        <path className="uim-tertiary" d="M11,7c-3.08339,0.00031-5.66461,2.33759-5.97,5.40582c2.5358-1.08949,5.47469,0.08297,6.56418,2.61877c0.54113,1.25947,0.54113,2.68593,0,3.94541c3.29729-0.32786,5.7045-3.26663,5.37664-6.56392C16.66569,9.33735,14.08386,6.99972,11,7z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                   
                    <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                        <div className="card service-wrapper rounded border-0 shadow p-4">
                            <div className="icon text-center text-custom h1 shadow rounded bg-white">
                                <span className="uim-svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em">
                                        <path className="uim-quaternary" d="M6,23H2a.99974.99974,0,0,1-1-1V16a.99974.99974,0,0,1,1-1H6a.99974.99974,0,0,1,1,1v6A.99974.99974,0,0,1,6,23Z"></path>
                                        <path className="uim-tertiary" d="M22,15H15a1.00067,1.00067,0,0,0-1,1v6a1.00067,1.00067,0,0,0,1,1h7a1.00067,1.00067,0,0,0,1-1V16A1.00067,1.00067,0,0,0,22,15ZM13,11h4v1a1,1,0,0,0,2,0V11h4a1,1,0,0,0,0-2H19V8a1,1,0,0,0-2,0V9H13a1,1,0,0,0,0,2ZM6,2H2A1,1,0,0,0,2,4H6a1,1,0,0,0,0-2ZM10,7h3v1a1,1,0,0,0,2,0V7h3a1,1,0,0,0,0-2H15V4a1,1,0,0,0-2,0V5H10a1,1,0,0,0,0,2ZM6,13H2a1,1,0,0,0,0,2H6a1,1,0,0,0,0-2ZM10,19h4v1a1,1,0,0,0,2,0V19h4a1,1,0,0,0,0-2H16V16a1,1,0,0,0-2,0v1H10a1,1,0,0,0,0,2Z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="content mt-4">
                                <h5 className="title">Système de notification et géolocalisation des interventions </h5>
                                <p className="text-muted mt-3 mb-0">
                                    It is a long established fact that a reader will be distracted by the when looking at its layout.
                                </p>
                                <div className="mt-3">
                                    <a href="javascript:void(0)" className="text-custom">
                                        En savoir plus <i className="mdi mdi-chevron-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="big-icon h1 text-custom">
                                <span className="uim-svg">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em">
                                        <path className="uim-quaternary" d="M6,23H2a.99974.99974,0,0,1-1-1V16a.99974.99974,0,0,1,1-1H6a.99974.99974,0,0,1,1,1v6A.99974.99974,0,0,1,6,23Z"></path>
                                        <path className="uim-tertiary" d="M22,15H15a1.00067,1.00067,0,0,0-1,1v6a1.00067,1.00067,0,0,0,1,1h7a1.00067,1.00067,0,0,0,1-1V16A1.00067,1.00067,0,0,0,22,15ZM13,11h4v1a1,1,0,0,0,2,0V11h4a1,1,0,0,0,0-2H19V8a1,1,0,0,0-2,0V9H13a1,1,0,0,0,0,2ZM6,2H2A1,1,0,0,0,2,4H6a1,1,0,0,0,0-2ZM10,7h3v1a1,1,0,0,0,2,0V7h3a1,1,0,0,0,0-2H15V4a1,1,0,0,0-2,0V5H10a1,1,0,0,0,0,2ZM6,13H2a1,1,0,0,0,0,2H6a1,1,0,0,0,0-2ZM10,19h4v1a1,1,0,0,0,2,0V19h4a1,1,0,0,0,0-2H16V16a1,1,0,0,0-2,0v1H10a1,1,0,0,0,0,2Z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    
      <section id="contact">
  <div className="row justify-content-center">
    <div className="col-12">
      <div className="contenair">
        <Contact />
      </div>
    </div>
  </div>
</section>

     

<section id="about" style={{ backgroundColor: 'black', color: 'white', minHeight: '50vh', display: 'flex', flexDirection: 'column', minWidth: '100vh' }}>
  <div className="container my-5" style={{ flex: 1, minHeight: '50vh', display: 'flex', flexDirection: 'column', minWidth: '100vh' }}>
        {/* Footer */}
        <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#1c2331' }}>
          {/* Section: Social media */}
          <section className="d-flex justify-content-between p-4" style={{ backgroundColor: '#6351ce' }}>
            {/* Left */}
            <div className="me-5">
              <span>Restez connecté avec nous sur les réseaux sociaux :</span>
            </div>
            {/* Left */}

            {/* Right */}
            <div>
              <a href="#" className="text-white me-4">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white me-4">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white me-4">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="text-white me-4">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white me-4">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-white me-4">
                <i className="fab fa-github"></i>
              </a>
            </div>
            {/* Right */}
          </section>
          {/* Section: Social media */}

          {/* Section: Links */}
          <div className="footerr">
            <section id="footer">
              <div className="container text-center text-md-start mt-5">
                {/* Grid row */}
                <div className="row mt-3">
                  {/* Grid column */}
                  <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                    {/* Content */}
                    <h6 className="text-uppercase fw-bold">GMAO DZ</h6>
                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                    <p>
                      Ici, vous pouvez utiliser des lignes et des colonnes pour organiser le contenu de votre pied de page. Gestion de Maintenance Assistée par Ordinateur.
                    </p>
                  </div>
                  {/* Grid column */}

                  {/* Grid column */}
                  <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                    {/* Links */}
                    <h6 className="text-uppercase fw-bold">Produits</h6>
                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                    <p><a href="#!" className="text-white">MDBootstrap</a></p>
                    <p><a href="#!" className="text-white">MDWordPress</a></p>
                    <p><a href="#!" className="text-white">BrandFlow</a></p>
                    <p><a href="#!" className="text-white">Bootstrap Angular</a></p>
                  </div>
                  {/* Grid column */}

                  {/* Grid column */}
                  <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                    {/* Links */}
                    <h6 className="text-uppercase fw-bold">Liens Utiles</h6>
                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                    <p><a href="#!" className="text-white">Votre Compte</a></p>
                    <p><a href="#!" className="text-white">Devenir Affilié</a></p>
                    <p><a href="#!" className="text-white">Tarifs de Livraison</a></p>
                    <p><a href="#!" className="text-white">Aide</a></p>
                  </div>
                  {/* Grid column */}

                  {/* Grid column */}
                  <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                    {/* Links */}
                    <h6 className="text-uppercase fw-bold">Contact</h6>
                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                    <p><i className="fas fa-home mr-3"></i> Ghazaouet, Algérie</p>
                    <p><i className="fas fa-envelope mr-3"></i> info@example.com</p>
                    <p><i className="fas fa-phone mr-3"></i> +213 6 75 43 24 50</p>
                    <p><i className="fas fa-print mr-3"></i> +213 6 75 43 24 50</p>
                  </div>
                  {/* Grid column */}
                </div>
                {/* Grid row */}
              </div>
            </section>
            {/* Section: Links */}

            {/* Copyright */}
            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              © 2020 Copyright:
              <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
            </div>
            {/* Copyright */}
          </div>
        </footer>
        {/* Footer */}
      </div>
    </section>
    </>
  );
};
 
export default Header;
