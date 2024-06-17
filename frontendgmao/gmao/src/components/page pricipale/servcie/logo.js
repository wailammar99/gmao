// Logo.js
import React from 'react';
import Service from './service';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';



import '@fortawesome/fontawesome-free/css/all.min.css'


import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faCircle, faSquareRootAlt, faBell,faMessage,faMap,faChartSimple,faFile} from '@fortawesome/free-solid-svg-icons'; // Import the desired Font Awesome icons

const logo1 = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em">
        <rect width="20" height="15" x="2" y="3" className="uim-tertiary" rx="3"></rect>
        <path className="uim-primary" d="M16,21H8a.99992.99992,0,0,1-.832-1.55469l4-6a1.03785,1.03785,0,0,1,1.66406,0l4,6A.99992.99992,0,0,1,16,21Z"></path>
    </svg>
);


const logo2 = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em">
        <path className="uim-quaternary" d="M15,2c-3.3772,0.00142-6.27155,2.41462-6.88025,5.73651c2.90693-1.59074,6.553-0.52375,8.14374,2.38317c0.98206,1.79462,0.98206,3.96594,0,5.76057c3.8013-0.69634,6.31837-4.3424,5.62202-8.14369C21.27662,4.41261,18.37925,1.99872,15,2z"></path>
        <circle cx="7" cy="17" r="5" className="uim-primary"></circle>
        <path className="uim-tertiary" d="M11,7c-3.08339,0.00031-5.66461,2.33759-5.97,5.40582c2.5358-1.08949,5.47469,0.08297,6.56418,2.61877c0.54113,1.25947,0.54113,2.68593,0,3.94541c3.29729-0.32786,5.7045-3.26663,5.37664-6.56392C16.66569,9.33735,14.08386,6.99972,11,7z"></path>
    </svg>
);

const logo3 = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em">
        <path className="uim-quaternary" d="M6,23H2a.99974.99974,0,0,1-1-1V16a.99974.99974,0,0,1,1-1H6a.99974.99974,0,0,1,1,1v6A.99974.99974,0,0,1,6,23Z"></path>
        <path className="uim-tertiary" d="M22,15H15a1.00067,1.00067,0,0,0-1,1v6a1.00067,1.00067,0,0,0,1,1h7a1.00067,1.00067,0,0,0,1-1V16A1.00067,1.00067,0,0,0,22,15ZM13,11h4v1a1,1,0,0,0,2,0V11h4a1,1,0,0,0,0-2H19V8a1,1,0,0,0-2,0V9H13a1,1,0,0,0,0,2ZM6,2H2A1,1,0,0,0,2,4H6a1,1,0,0,0,0-2ZM10,7h3v1a1,1,0,0,0,2,0V7h3a1,1,0,0,0,0-2H15V4a1,1,0,0,0-2,0V5H10a1,1,0,0,0,0,2ZM6,13H2a1,1,0,0,0,0,2H6a1,1,0,0,0,0-2ZM10,19h4v1a1,1,0,0,0,2,0V19h4a1,1,0,0,0,0-2H16V16a1,1,0,0,0-2,0v1H10a1,1,0,0,0,0,2Z"></path>
    </svg>
);

const Logo = () => {
    const { t } = useTranslation();
    return (
        <div className="row justify-content-center">
        <Service
            title={t('intervention_tracking_title')} // Translate the title
            description={t('intervention_tracking')} // Translate the description
            logo={logo1}
        />
        <Service
            title={t('user_conversation_title')} // Translate the title
            description={t('user_conversation')} // Translate the description
            logo={<FontAwesomeIcon icon={faMessage} className="uim-primary" />}
        />
        <Service
            title={t('notification_title')} // Translate the title
            description={t('notification')} // Translate the description
            logo={<FontAwesomeIcon icon={faBell} className="uim-primary" />}
        />

        {/* Service for map */}
        <Service
            title={t('mapping_service_title')} // Translate the title
            description={t('mapping_service')} // Translate the description
            logo={<FontAwesomeIcon icon={faMap} className='uim-primary' />}
        />

        {/* Service for statistics */}
        <Service
            title={t('statistical_service_title')} // Translate the title
            description={t('statistical_service')} // Translate the description
            logo={<FontAwesomeIcon icon={faChartSimple} />}
        />

        {/* Service for reports */}
        <Service
            title={t('report_service_title')} // Translate the title
            description={t('report_service')} // Translate the description
            logo={<FontAwesomeIcon icon={faFile} />}
        />
    </div>
    );
};

export default Logo;
