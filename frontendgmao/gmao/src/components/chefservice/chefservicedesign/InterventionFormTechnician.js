import React, { useState, useEffect } from 'react'; // Import useState and useEffect


const InterventionFormTechnician = ({ interventionId, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedOption: '',
    selectedEquipment: [], // State for selected equipment as an array
    inputField: '',
    startDate:   interventionId.date_debut ,
    endDate: '',
    

    
  });
  console.log('Intervention ID:', interventionId);
 
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    try {
      const serviceResponse = await fetch(`http://127.0.0.1:8000/liste_technicien/${interventionId}/`);
      const equipmentResponse = await fetch(`http://127.0.0.1:8000/liste_equipment/`);
      const intervtion_info=await fetch(`http://127.0.0.1:8000/api/intervention/${interventionId}/`);

      if (serviceResponse.ok && equipmentResponse.ok) {
        const serviceData = await serviceResponse.json();
        const equipmentData = await equipmentResponse.json();
        const interventionData = await intervtion_info.json();
        
        setFormData(prevState => ({
          ...prevState,
          serviceOptions: serviceData,
          equipmentOptions: equipmentData,
          startDate: interventionData.date_debut || '', // Include startDate in the request body
          endDate: interventionData.date_fin ||''
        }));
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
          equipment_ids: formData.selectedEquipment,
          start_date: formData.startDate, // Include startDate in the request body
          end_date: formData.endDate,
        }),
      });
  
      if (response.ok) {
        setShowMessage(true);
        setFormData({
          selectedOption: '',
          selectedEquipment: [],
          inputField: '',
        });
        onSubmit(formData);
      } else {
        console.error('Failed to assign service or technician');
      }
    } catch (error) {
      console.error('Error assigning service or technician:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'selectedEquipment' ? [...prevState.selectedEquipment, value] : value, // Update selected equipment array
    }));
  };

  return (
    <>
      

      <div className="intervention-form">
        <h2>Assign Service and Equipment</h2>
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">Date de début:</label>
            <input type="date" name="startDate" id="startDate" className="form-control" value={formData.startDate} onChange={handleChange} />
          </div>
          
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">Date de fin:</label>
            <input type="date" name="endDate" id="endDate" className="form-control" value={formData.endDate} onChange={handleChange} />
          </div>
            <label htmlFor="selectedOption" className="form-label">Select Service:</label>
            <select name="selectedOption" id="selectedOption" className="form-control" value={formData.selectedOption} onChange={handleChange}>
              <option value="">Select a service</option>
              {formData.serviceOptions && formData.serviceOptions.map(option => (
                <option key={option.id} value={option.id}>{option.username}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="selectedEquipment" className="form-label">Select Equipment:</label>
            <select name="selectedEquipment" id="selectedEquipment" className="form-control" multiple value={formData.selectedEquipment} onChange={handleChange}>
              {/* Use 'multiple' attribute for selecting multiple options */}
              <option value="">Select equipment</option>
              {formData.equipmentOptions && formData.equipmentOptions.map(option => (
                <option key={option.id} value={option.id}>{option.equipmentName || option.nom}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="inputField" className="form-label">Additional Input:</label>
            <input type="text" name="inputField" id="inputField" className="form-control" value={formData.inputField} onChange={handleChange} />
          </div>
          
          <button type="submit" className="btn btn-primary">Assign Service and Equipment</button>
        </form>
      </div>
    </>
  );
};

export default InterventionFormTechnician;