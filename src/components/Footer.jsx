import React from 'react';

const Footer = () => {
    return (
        <footer style={{ padding: '40px 0', borderTop: '1px solid var(--border-color)', marginTop: '60px' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h3>SOCRATES.DESIGN</h3>
                    <p style={{ color: '#888' }}>Creating digital experiences that matter.</p>
                </div>
                <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>Socials</h4>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="#">LinkedIn</a>
                        <a href="#">Dribbble</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </div>
            <div className="container" style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                &copy; {new Date().getFullYear()} Socrates Mocharla. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
