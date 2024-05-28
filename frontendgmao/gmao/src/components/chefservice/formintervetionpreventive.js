import React, { useState, useEffect } from 'react';
import PopupMessage from '../message';
import { useNavigate } from 'react-router-dom';
import Sidebar from './chefservicedesign/sidebar/sidebar';
import Navbar from './chefservicedesign/navbar/navbar';
import "./prevntive.scss";
import Checkbox from '@mui/material/Checkbox';


const API_BASE_URL = 'http://127.0.0.1:8000';

const Forminterventionpreventive = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    adresse: '',
    startDate: '',
    endDate: '',
    selectedOption: '',
    selectedEquipment: [],
  });
  const [serviceOptions, setServiceOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const navigate = useNavigate();
  const userid = localStorage.getItem("userId");

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const serviceResponse = await fetch(`${API_BASE_URL}/api_liste_technicien_par_service/${userid}/`);
      const equipmentResponse = await fetch(`${API_BASE_URL}/equipements/${userid}/`);

      if (serviceResponse.ok && equipmentResponse.ok) {
        const serviceData = await serviceResponse.json();
        const equipmentData = await equipmentResponse.json();

        setServiceOptions(serviceData);
        setEquipmentOptions(equipmentData);
      } else {
        console.error('Failed to fetch dropdown options');
      }
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { titre, startDate, endDate, selectedOption, selectedEquipment, adresse, description } = formData;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api_create_intervention_preventive/${userid}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre,
          date_debut: startDate,
          date_fin: endDate,
          technicien: selectedOption,
          equipment_ids: selectedEquipment,
          adresse,
          description,
        }),
      });

      if (response.ok) {
        showMessagePopup("L'intervention est bien assignée.", "success");
        resetForm();
      } else if (response.status === 401) {
        showMessagePopup("Entrez les dates correctement.", "danger");
      }
    } catch (error) {
      console.error('Error assigning service or technician:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const selectedEquipment = formData.selectedEquipment;

    setFormData({
      ...formData,
      selectedEquipment: checked
        ? [...selectedEquipment, name]
        : selectedEquipment.filter(item => item !== name),
    });
  };

  const showMessagePopup = (msg, clr) => {
    setMessage(msg);
    setColor(clr);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      adresse: '',
      startDate: '',
      endDate: '',
      selectedOption: '',
      selectedEquipment: [],
    });
    onSubmit();
    onClose();
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        {showMessage && <PopupMessage message={message} color={color} />}
        <div className="intervention-form">
          <h2>Attribuer le technicien et l'équipement</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="mb-3 formInput">
              <label htmlFor="titre" className="form-label">Titre:</label>
              <input
                type="text"
                id="titre"
                name="titre"
                className="form-control"
                value={formData.titre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3 formInput">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3 formInput">
              <label htmlFor="adresse" className="form-label">Adresse:</label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                className="form-control"
                value={formData.adresse}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3 formInput">
              <label htmlFor="startDate" className="form-label">Date de début:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3 formInput">
              <label htmlFor="endDate" className="form-label">Date de fin:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3 formInput">
              <label htmlFor="selectedOption" className="form-label">Sélectionner Technicien:</label>
              <select
                id="selectedOption"
                name="selectedOption"
                className="form-control"
                value={formData.selectedOption}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner Technicien</option>
                {serviceOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.username}</option>
                ))}
              </select>
            </div>
            <div className="mb-3 formInput">
            <label className="form-label">Sélectionner Équipement:</label>
<div className="equipment-selection">
  <div className="equipment-list">
    {equipmentOptions.map(option => (
      <div key={option.id} className="form-check">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Checkbox
            id={`equipment-${option.id}`}
            name={option.id.toString()}
            checked={formData.selectedEquipment.includes(option.id.toString())}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={`equipment-${option.id}`} className="form-check-label">{option.equipmentName || option.nom}</label>
        </div>
      </div>

    ))}
  </div>
  </div>
</div>
            <div className="mb-3 formButton">
              <button type="submit" className="btn btn-primary">Valider technicien et équipement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forminterventionpreventive;
