import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">SOCRATES.DESIGN</Link>

                <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/portfolio">Work</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/blog">Insights</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <div className="hamburger" onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
