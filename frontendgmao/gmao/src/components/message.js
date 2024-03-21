import React, { useState } from 'react';

const PopupMessage = ({ message, color }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {show && (
        <div
          className={`alert fade show alert-${color}`}
          role="alert"
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1000', minWidth: '200px' }}
        >
          {message}
          <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
        </div>
      )}
    </>
  );
};

export default PopupMessage;
