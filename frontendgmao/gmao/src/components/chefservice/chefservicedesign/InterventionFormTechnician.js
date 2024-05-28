import React, { useState, useEffect } from 'react';
import PopupMessage from '../../message';
import { Navigate, useNavigate } from 'react-router-dom';
 
const InterventionFormTechnician = ({ interventionId, onSubmit ,onClose,fetchData  }) => {
  console.log("Intervention ID:", interventionId);
  const [formData, setFormData] = useState({
    selectedOption: '',
    selectedEquipment: [], // State for selected equipment IDs as an array
    inputField: '',
    startDate: interventionId.date_debut || '',
    endDate: '',
  });

  const userid=localStorage.getItem("userId");
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [selectedEquipmentsDetails, setSelectedEquipmentsDetails] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const [message,setmessage]=useState("");
  const [color,setcolor]=useState("");
 
  useEffect(() => {
    fetchDropdownOptions();
  }, []);
 
  const fetchDropdownOptions = async () => {
    try {
      const serviceResponse = await fetch(`http://127.0.0.1:8000/liste_technicien/${interventionId}/`);
      const equipmentResponse = await fetch(`http://127.0.0.1:8000/equipements/${userid}/`);
      const intervention_info = await fetch(`http://127.0.0.1:8000/api/intervention/${interventionId}/`);
 
      if (serviceResponse.ok && equipmentResponse.ok) {
        const serviceData = await serviceResponse.json();
        const equipmentData = await equipmentResponse.json();
        const interventionData = await intervention_info.json();
       
        setFormData(prevState => ({
          ...prevState,
          serviceOptions: serviceData,
          startDate: interventionData.date_debut || '',
          endDate: interventionData.date_fin || ''
        }));
 
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
     
    try {
      const response = await fetch(`http://127.0.0.1:8000/api_assigne_service/${interventionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: formData.selectedOption,
          equipment_ids: formData.selectedEquipment, // Include selected equipment IDs
          start_date: formData.startDate,
          end_date: formData.endDate,
        }),
      });
 
      if (response.ok) {
        setShowMessage(true);
        setcolor("success");
        setmessage("L'intervention est bien assignée.");
       
        setTimeout(() => {
          
          setShowMessage(false);
          onSubmit();
          onClose();
         
         

         
        }, 1500);
        setFormData({
          selectedOption: '',
          selectedEquipment: [],
          inputField: '',
        });
 
        // Get details of selected equipments
        const selectedEquipmentsDetails = formData.selectedEquipment.map(equipId => {
          const equipment = equipmentOptions.find(equip => equip.id === parseInt(equipId));
          return equipment ? equipment.equipmentName || equipment.nom : 'Unknown equipment';
        });
 
        setSelectedEquipmentsDetails(selectedEquipmentsDetails);
 
        onSubmit(formData);
      } else if (response.status===401) {
        setShowMessage(true);
        setcolor("danger");
        setmessage("enter les date correctement ");
        
        setTimeout(() => {
        
          setShowMessage(false);
          
        }, 1500);
        
      }
    } catch (error) {
      console.error('Error assigning service or technician:', error);
    }
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
 
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setFormData(prevState => ({
        ...prevState,
        selectedEquipment: [...prevState.selectedEquipment, name],
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        selectedEquipment: prevState.selectedEquipment.filter(item => item !== name),
      }));
    }
  };
 
  return (
    <>
      {showMessage && (
        <PopupMessage
          message={message}
          color={color}
        />
      )}
 
      <div className="intervention-form">
        <h2>Attribuer le technique et l'équipement</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Date de début:</label>
              <input type="date" name="startDate" id="startDate" className="form-control" value={formData.startDate} onChange={handleChange} required />
            </div>
           
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">Date de fin:</label>
              <input type="date" name="endDate" id="endDate" className="form-control" value={formData.endDate} onChange={handleChange} required/>
            </div>
            <label htmlFor="selectedOption" className="form-label">Sélect Technicien:</label>
            <select name="selectedOption" id="selectedOption" className="form-control" value={formData.selectedOption} onChange={handleChange} required>
              <option value="">Sélect Technicien</option>
              {formData.serviceOptions && formData.serviceOptions.map(option => (
                <option key={option.id} value={option.id}>{option.username}</option>
              ))}
            </select>
          </div>
         
          <div className="mb-3">
            <label className="form-label">Sélect Equipment:</label>
            {equipmentOptions.map(option => (
              <div key={option.id} className="form-check">
                <input
                  type="checkbox"
                  id={`equipment-${option.id}`}
                  name={option.id.toString()}
                  className="form-check-input"
                  checked={formData.selectedEquipment.includes(option.id.toString())}
                  onChange={handleCheckboxChange}
                 
                />
                <label htmlFor={`equipment-${option.id}`} className="form-check-label">{option.equipmentName || option.nom}</label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">Valider technicien et  equiment</button>
        </form>
 
        {/* Display selected equipments */}
        
      </div>
    </>
  );
};
 
export default InterventionFormTechnician;