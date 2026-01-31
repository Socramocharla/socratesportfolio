import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Services = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        api.get('/services')
            .then(res => setServices(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <h1>Services</h1>
            <p style={{ maxWidth: '600px', margin: '20px auto 60px', color: '#888' }}>
                Scalable design solutions tailored to your business needs, from MVP to enterprise.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                {services.map(service => (
                    <div key={service.id} className="glass-card" style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--accent-color)' }}>
                            {/* Simple icon placeholder based on name or generic */}
                            ★
                        </div>
                        <h3>{service.title}</h3>
                        <p style={{ marginBottom: '20px', color: '#ccc' }}>{service.description}</p>
                        <div style={{ fontWeight: 'bold' }}>{service.price_range}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
