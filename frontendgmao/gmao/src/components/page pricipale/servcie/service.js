import React from 'react';

const Service = ({ title, description, logo }) => {
    return (
        <div className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
            <div className="card service-wrapper rounded border-0 shadow p-4">
                <div className="icon text-center text-custom h1 shadow rounded bg-white">
                    <span className="uim-svg">
                        {logo}
                    </span>
                </div>
                <div className="content mt-4">
                    <h5 className="title">{title}</h5>
                    <p className="text-muted mt-3 mb-0 description">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default Service;
