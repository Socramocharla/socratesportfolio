import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const About = () => {
    const [settings, setSettings] = useState({});
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        api.get('/settings').then(res => setSettings(res.data));
        api.get('/skills').then(res => setSkills(res.data));
    }, []);

    return (
        <div className="container" style={{ paddingTop: '150px' }}>
            <div style={{ display: 'flex', gap: '80px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '100px' }}>
                <div style={{ flex: 1.2, minWidth: '300px' }}>
                    <div className="text-mask">
                        <motion.h1
                            initial={{ y: "100%" }}
                            whileInView={{ y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }}
                            style={{ fontSize: '4rem', marginBottom: '30px' }}
                        >
                            About Me
                        </motion.h1>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        style={{ fontSize: '1.4rem', marginBottom: '20px', lineHeight: '1.6' }}
                    >
                        {settings.about_text || "I'm Socrates, a digital product designer with a background in cognitive psychology."}
                    </motion.p>
                    {settings.resume_file && (
                        <motion.a
                            href={settings.resume_file}
                            target="_blank"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            style={{ borderRadius: '50px', display: 'inline-block', textDecoration: 'none' }}
                        >
                            Download Resume
                        </motion.a>
                    )}
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{ flex: 1, height: '500px', background: '#111', borderRadius: '30px', overflow: 'hidden' }}
                >
                    {settings.profile_image ? (
                        <img src={settings.profile_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontSize: '2rem' }}>PORTRAIT</div>
                    )}
                </motion.div>
            </div>

            <div style={{ marginTop: '100px' }}>
                <h2>My Toolkit</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '30px', paddingBottom: '100px' }}>
                    {skills.length > 0 ? skills.map(skill => (
                        <span key={skill.id} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px' }}>{skill.name}</span>
                    )) : (
                        ['Figma', 'Adobe XD', 'Protopie', 'React', 'HTML/CSS', 'Blender'].map(tool => (
                            <span key={tool} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '30px' }}>{tool}</span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;
