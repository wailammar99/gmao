
import React, { useEffect,useState } from 'react';
import './pageh.scss'; 
import 'bootstrap/dist/css/bootstrap.min.css';


import Contact from '../contactform';
import { useTranslation } from 'react-i18next';
import '@fortawesome/fontawesome-free/css/all.min.css'

import './pageh.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'; 
import Service from './servcie/service';
import Logo from './servcie/logo';



const Header = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg']; // Add your image URLs here
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };


  const handleNextClick = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevClick = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };


  return (
    <div className='page-specific'>
    <div className="nav">
    <div className="logo">
            {/* Utilisez src au lieu de href pour spécifier l'URL de l'image */}
            <img src="/logoo.png" alt="Logo" />
          </div>
        <ul>
        <li><a href="#home"><i></i>{t('home')}</a></li>
       
        <li><a href="#features">{t('features')}</a></li>
        <li><a href="/login">{t('login')}</a></li>
        <li><a href="#contact">{t('contact')}</a></li>
        <li>
          <a onClick={() => changeLanguage('en')}>English</a> </li>
         <li> <a onClick={() => changeLanguage('fr')}>Français</a></li>
       

          </ul>
    </div>
    <header style={{ display: 'flex', alignItems: 'flex-start', padding: '35px' ,border:"solid",background:"rgb(113, 166, 245)" }} >
  <div className="title" id="home" style={{ flex: '1', marginRight: '20px' }}>
    <h1 style={{ padding: '10px' }}>{t('gmao')}</h1>
    <h6>{t('gmao_full')}</h6>
  </div>
  <div className="gallery" style={{ flex: '2', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={images[currentImage]}
        alt="Navigate"
        style={{ height: '300px', width: '%', border: 'solid', marginTop: '10px' }}
      />
      <Box className="button" position="absolute" top="50%" left="0" right="0" textAlign="center" mt={2} paddingTop="132px">
        <Button onClick={handlePrevClick} sx={{ textTransform: 'none', padding: '10px 20px', marginRight: '5px' }}>
          <ArrowBackIosIcon>  </ArrowBackIosIcon>
        </Button>
        <Button onClick={handleNextClick} sx={{ textTransform: 'none', padding: '10px 20px', marginLeft: '5px' }}>
        <ArrowForwardIosIcon></ArrowForwardIosIcon>
        </Button>
      </Box>
    </div>
    
  </div>
</header>
      <section id="features" style={{ paddingLeft: "100px" ,border:"solid",borderColor:"white" }} >


      <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-2">
                            <h1 className="display-1" id="services" style={{frontsize:"200px"}}>{t('service')}</h1>
                        </div>
                    </div>
                    <Logo/>
                </div>
              </div>
                
        </div>
      </section>
    
      <section id="contact" style={{border:"solid", borderColor:"white"}}>
  <div className="row justify-content-center">
    <div className="col-12">
      <div className="contenair">
        <Contact />
      </div>
    </div>
  </div>
</section>

     


 
        {/* Footer */}
        <footer className="text-center text-lg-start text-white" style={{ backgroundColor: 'black' }} >
          {/* Section: Social media */}
          <section className="d-flex justify-content-between p-4" style={{ backgroundColor: 'black' }}>
            {/* Left */}
            <div className="me-5">
              <span>Restez connecté avec nous sur les réseaux sociaux :</span>
            </div>
            {/* Left */}

            {/* Right */}
            <div className='socio'>
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
          <div className="footerr" color='white' backgroundColor="black">
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

                  {/* Grid column */}

                  {/* Grid column */}
                  <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                    {/* Links */}
                    <h6 className="text-uppercase fw-bold">Liens Utiles</h6>
                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                    <p><a href="login" className="text-white">Votre Compte</a></p>
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
              © 2024 Copyright:
              
            </div>
            {/* Copyright */}
          </div>
        </footer>
        {/* Footer */}
     
    
    </div>
  );
};
 
export default Header;
