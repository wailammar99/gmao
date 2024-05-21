import React, { useState, useEffect } from 'react';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import Navbar from './chefservicedesign/navbar/navbar';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';

const CreateEquipment = () => {
  const [nom, setNom] = useState('');
  const [marque, setMarque] = useState('');
  const [prix, setPrix] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [caracteristiquesTechniques, setCaracteristiquesTechniques] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const navigate = useNavigate();
  const user_id = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleCreateEquipment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:8000/api_create_equipment/${user_id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`, // Corrected header
        },
        body: JSON.stringify({
          nom,
          marque,
          prix,
          description,
          stock,
          numero_serie: numeroSerie,
          date_expiration: dateExpiration,
          caracteristiques_techniques: caracteristiquesTechniques,
        }),
      });

      if (response.ok) {
        setMessage('equiment est bien cree ');
        setMessageColor('success');
        setShowMessage(true);
        setTimeout(() => {
          navigate('/listeequipement'); // Adjust the navigation target as needed
        }, 3000);
      } else if (response.status === 400) {
        setMessage('Service ID is required');
        setMessageColor('warning');
        setShowMessage(true);
      } else if (response.status === 404) {
        setMessage('Service does not exist');
        setMessageColor('danger');
        setShowMessage(true);
      } else {
        setMessage('An error occurred');
        setMessageColor('danger');
        setShowMessage(true);
      }
    } catch (error) {
      setMessage('Error creating equipment: ' + error.message);
      setMessageColor('danger');
      setShowMessage(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showMessage]);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <h2 className="card-title">creé nouveux equiment</h2>
        {showMessage && <PopupMessage message={message} color={messageColor} />}
        <form onSubmit={handleCreateEquipment}>
          <div className="formInput">
            <label htmlFor="nom" className="form-label">Nom</label>
            <input type="text" className="form-control" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
          </div>
          <div className="formInput">
            <label htmlFor="marque" className="form-label">Marque</label>
            <input type="text" className="form-control" id="marque" value={marque} onChange={(e) => setMarque(e.target.value)} required />
          </div>
          <div className="formInput">
            <label htmlFor="prix" className="form-label">Prix</label>
            <input type="number" className="form-control" id="prix" value={prix} onChange={(e) => setPrix(e.target.value)} required />
          </div>
          <div className="formInput">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="formInput">
            <label htmlFor="stock" className="form-label">Stock</label>
            <input type="number" className="form-control" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
          <div className="formInput">
            <label htmlFor="numeroSerie" className="form-label">Numéro de série</label>
            <input type="text" className="form-control" id="numeroSerie" value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} />
          </div>
          <div className="formInput">
            <label htmlFor="dateExpiration" className="form-label">Date d'expiration</label>
            <input type="date" className="form-control" id="dateExpiration" value={dateExpiration} onChange={(e) => setDateExpiration(e.target.value)} />
          </div>
          <div className="formInput">
            <label htmlFor="caracteristiquesTechniques" className="form-label">Caractéristiques techniques</label>
            <input type="text" className="form-control" id="caracteristiquesTechniques" value={caracteristiquesTechniques} onChange={(e) => setCaracteristiquesTechniques(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Create Equipment</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEquipment;
