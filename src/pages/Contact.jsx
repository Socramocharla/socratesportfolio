import React, { useState } from 'react';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            await api.post('/contact', formData);
            setStatus('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('Failed to send message.');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '15px',
        marginBottom: '20px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border-color)',
        color: 'white',
        borderRadius: '4px'
    };

    return (
        <div className="container" style={{ paddingTop: '120px', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '20px' }}>Get In Touch</h1>
            <p style={{ marginBottom: '40px', color: '#888' }}>Have a project in mind? Let's build something great together.</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    style={{ ...inputStyle, height: '150px' }}
                    required
                ></textarea>

                <button type="submit" className="btn" style={{ width: '100%' }}>Send Message</button>
                {status && <p style={{ marginTop: '20px', textAlign: 'center', color: status.includes('Failed') ? 'red' : 'green' }}>{status}</p>}
            </form>
        </div>
    );
};

export default Contact;
