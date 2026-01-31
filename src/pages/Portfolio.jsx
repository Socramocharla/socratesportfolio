import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        api.get('/case-studies')
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    }, []);

    const categories = ['All', 'Mobile', 'Web', 'SaaS'];
    const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

    return (
        <div className="container" style={{ paddingTop: '120px' }}>
            <h1 style={{ marginBottom: '40px' }}>My Work</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        style={{
                            background: filter === cat ? 'white' : 'transparent',
                            color: filter === cat ? 'black' : 'white',
                            border: '1px solid white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                {filteredProjects.map((project) => (
                    <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Link to={`/portfolio/${project.slug}`}>
                            <div style={{ height: '240px', background: '#222', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden' }}>
                                {project.hero_image_url ?
                                    <img src={project.hero_image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={project.title} /> :
                                    null
                                }
                            </div>
                            <h3>{project.title}</h3>
                            <p style={{ color: '#888' }}>{project.category}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio;
