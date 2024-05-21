import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { Navigate } from 'react-router-dom';
import PasswordResetForm from './components/passwordsetup';


import CreateService from './components/admin/createservice/CreateService';
import CreateUser from './components/admin/admindesign/createusser/create_user';
import UserProfile from './components/proifl';

import ConversationForm from './components/citoyen/ConversationForm';
import technicineprofil from './components/technicien/technicineprofil';

import Intervention from './components/directeur/intervention';

import Pagetechnicien from './components/technicien/techniciendesign/hometechnicien';
import Technicienpage from './components/technicien/technicienpage';

import AdminPage from './components/admin/admindesign/adminpage';

import Link from './components/admin/admindesign/link';
import ListService from './components/admin/listeservice';

import Pagedirecteur from './components/directeur/directeurdesi/pagedirecteur';
import Rapportform from './components/directeur/Raportfomr';
import Listcostumer from './components/directeur/Listcostumer';
import Listtechnicien from './components/directeur/listetechnicien';
import Listchefservice from './components/directeur/listechefservice';
import CompteNoActive from './components/directeur/noucompte';
import ConversationMessagesdir from './components/directeur/convrmessgedir';

import Chefservice from './components/chefservice/chefservicedesign/pagechefservice/pagechefservice';
import Chefservicepage from './components/chefservice/chefservicedesign/Chefservicepage';
import Chefserviceprofil from './components/chefservice/chefserviceprofil';
import Listtechnicienparservice from './components/chefservice/chefservicedesign/Listtechnicienparservice';
import Citoyenpage from './components/citoyen/cityoenpage';
import Pagecityoen from './components/citoyen/cityoendesign/homecitoyen';
import ConversationMessages from './components/citoyen/conversationmessage';
import CreateInterventionForm from './components/citoyen/createintervention';
import Calendertechncien from './components/technicien/Calendertechncien';
import NotificationPageTechnicine from './components/technicien/notificationtechnicine';
import Technicineprofil from './components/technicien/technicineprofil';
import NotificationPagechefservice from './components/chefservice/notifationchefservice';
import Citoyenprofil from './components/citoyen/citoyenprofil';
import Notificationcitoyen from './components/citoyen/citoyennotification';

import Notificationdirecteur from './components/directeur/notificationdirecteur';
import MessagePopup from './components/directeur/messagepopdirecteur';
import Directeurprofil from './components/directeur/directeurprofil';
import Adminprofil from './components/admin/admindesign/adminprofil';
import ConversationFormchefservice from './components/chefservice/conversationformchefservice';
import ConversationMessageschefservice from './components/chefservice/conversationformchefservice';
import ConversationMessagesTechnicien from './components/technicien/cpnversationmessagetechnicien';
import ListEquipement from './components/chefservice/listeequiment';
import Contact from './components/contactform';
import WebSocketTest from './testwebsocketdjango';
import Notificationadmin from './components/admin/notificationadmin';
import Contactadmin from './components/admin/contactliste';
import Listerapport from './components/directeur/listeRapport';
import WebSocketComponent from './testwebsocketdjango';
import ConversationChat from './testwebsocketdjango';
import CreateEquipment from './components/chefservice/equimentform';
















function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={ <Login onLogin={handleLogin} />}
          />
          <Route
            path="/contact"
            element={<Contact></Contact>}
          />
            <Route
            path="/conversation/{id}/utilisateur/${userId}/"
            element={<ConversationChat/>}
          />
          
            <Route
            path="/login"
            element=<Login onLogin={handleLogin} />
          />
          <Route
            path="/adminprofil"
            element={ <Adminprofil onLogout={handleLogout} />}
          />
            
          <Route
            path="/admin_dashboard"
            element={ <AdminPage onLogout={handleLogout} /> }
          />
          <Route
            path="/UserListPage"
            element={ <Link onLogout={handleLogout} /> }
          />
          <Route
            path="/listeservice"
            element={ <ListService onLogout={handleLogout} /> }
          />
          <Route
          path="/CreateUser"
          element={ <CreateUser /> }
          />
            <Route
          path="/Notificationadmin"
          element={<Notificationadmin/>}
          />
              <Route
          path="/contactadmin"
          element={<Contactadmin/>}
          />


             <Route
            path="/directeur_dashboard"
            element= <Pagedirecteur onLogout={handleLogout} /> 
          />
            <Route
            path="/RaportForm"
            element= <Rapportform onLogout={handleLogout} /> 
          />
           <Route
            path="/listerapport"
            element= <Listerapport   onLogout={handleLogout} /> 
          />

          
             <Route path="/conversation/:id/directeur/:int" element={<ConversationMessagesdir />} />
          <Route
            path="/profildirecteur"
            element={ <Directeurprofil onLogout={handleLogout} />  }
          />

             <Route
            path="/notificationdiracteur"
            element={ <Notificationdirecteur onLogout={handleLogout} /> }
          />
         
         <Route
          path="/listecostumer"
          element={ <Listcostumer /> }
          /> 
           <Route
          path="/comptenouveux"
          element={ <CompteNoActive /> }
          /> 
           <Route
          path="/createequiment"
          element={ <CreateEquipment /> }
          /> 
        
         
          

         
          <Route
            path="/citoyen_dashboard"
            element={ <Pagecityoen onLogout={handleLogout} /> }
          />
         <Route
        path='/citoyenprofil'
        element={ <Citoyenprofil onLogout={handleLogout} /> }>

         </Route>
         <Route path='/Notificationcitoyen'
          element={ <Notificationcitoyen onLogout={handleLogout} /> }>

         </Route>
        <Route
            path="/technicien_dashboard/:Id"
            element={ <Pagetechnicien onLogout={handleLogout} />  }
          />
        
           <Route
          path="/technicienpage"
          element={ <Technicienpage />}
          />
           <Route path="/conversation/:id/technicien/:int" element={<ConversationMessagesTechnicien />} />
          <Route path="/calender/technien" element={ <Calendertechncien/> }>

          </Route>
          <Route path="/technicinenotificationpage" element={<NotificationPageTechnicine/> }>

          </Route>
          <Route path="/technicienprofil" element={ <Technicineprofil/> }>

             </Route>
          

       
           <Route
            path="/create-service"
            element={ <CreateService onLogout={handleLogout} /> }
          />
             <Route
            path="/profil"
            element={isLoggedIn ? <UserProfile /> : <Login onLogin={handleLogin} />}
  
          />
         
           <Route path="/CreateUser" element={<CreateUser />} />
           <Route path="/conversation/:id/citoyen/:int" element={<ConversationMessages />} />
           <Route
            path="/int"
          element={<Intervention />}

          />
           <Route
          path="/Listtechnicien"
          element={ <Listtechnicien /> }
          />
          <Route
          path="/Listtechnicienparservice"
          element={ <Listtechnicienparservice /> }
          />

          <Route
          path="/Listchefservice"
          element={ <Listchefservice /> }
          />
           <Route
            path="/listeequipement"
            element={ <ListEquipement onLogout={handleLogout} />   }
          />

        <Route
          path="/intervention"
          element={ <Intervention /> }
          />  
            <Route
            path="/chef_service_dashboard/:Id"
            element={ <Chefservice onLogout={handleLogout} /> }
          />
           <Route
          path="/Chefservicepage"
          element={ <Chefservicepage /> }
          />
             <Route
          path="/chefservice/profil"
          element={ <Chefserviceprofil /> }
          />
              <Route
          path="/chefservicenotificationpage"
          element={ <NotificationPagechefservice /> }
          />
           <Route path="/conversation/:id/chefservice/:int" element={<ConversationMessageschefservice />} />

           <Route
            path="/citoyen_dashboard/:Id"
            element={ <Pagecityoen onLogout={handleLogout} /> }
          /> 
           <Route
          path="/Citoyenpage"
          element={ <Citoyenpage /> }
          />
          <Route
          path="/create_intervention"
          element={ <CreateInterventionForm /> }
          />
           <Route
          path="/passwordsetup"
          element={ <PasswordResetForm /> }
          />
          
          
        
           
          
         
          {/* Add more routes for other pages */}
        </Routes>
        
        <header className="App-header">
          {/* Add any header content */}
     
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
