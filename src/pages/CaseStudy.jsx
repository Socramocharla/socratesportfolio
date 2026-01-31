import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const CaseStudy = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        api.get(`/case-studies/${slug}`)
            .then(res => setProject(res.data))
            .catch(err => console.error(err));
    }, [slug]);

    if (!project) return <div className="container" style={{ paddingTop: '100px' }}>Loading...</div>;

    // Shared Section Component
    const ContentSection = ({ title, text, image, reverse }) => (
        <div className="section" style={{ padding: '120px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexDirection: reverse ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    gap: '80px',
                    flexWrap: 'wrap'
                }}>
                    <motion.div
                        style={{ flex: 1, minWidth: '350px' }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }}
                    >
                        {title && <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-color)', marginBottom: '20px' }}>{title}</h3>}
                        <p style={{ fontSize: '1.4rem', lineHeight: '1.7', color: '#eee', fontWeight: '300', letterSpacing: '0.01em' }}>{text}</p>
                    </motion.div>

                    <motion.div
                        style={{ flex: 1.2, minWidth: '350px' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {image ? (
                            <img
                                src={image}
                                alt="Project step"
                                style={{
                                    width: '100%',
                                    borderRadius: '24px',
                                    boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}></div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );

    const images = project.images || [];

    // Define the core story parts
    const storyParts = [
        { title: "The Challenge", text: project.problem_statement },
        { title: "The Solution", text: project.solution },
        { title: "The Outcome", text: project.outcome }
    ].filter(part => part.text); // Only keep parts that have text

    return (
        <div className="case-study" style={{ background: '#080808', color: 'white', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div style={{ height: '90vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {project.hero_image_url &&
                    <motion.img
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ duration: 2 }}
                        src={project.hero_image_url}
                        alt="Hero"
                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                }
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1000px' }}>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ display: 'inline-block', padding: '8px 24px', border: '1px solid var(--accent-color)', borderRadius: '50px', marginBottom: '30px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent-color)', textTransform: 'uppercase' }}
                    >
                        {project.category}
                    </motion.span>
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.6, 0.01, -0.05, 0.95], delay: 0.3 }}
                        style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', marginBottom: '30px', lineHeight: 0.9, letterSpacing: '-3px' }}
                    >
                        {project.title}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        style={{ fontSize: '1.5rem', color: '#888', maxWidth: '700px', margin: '0 auto', fontWeight: '300' }}
                    >
                        {project.summary}
                    </motion.p>
                </div>
                <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}>
                    <div style={{ width: '1px', height: '100px', background: 'linear-gradient(to bottom, transparent, white)' }}></div>
                </div>
            </div>

            {/* Dynamic Content Sections */}
            {images.length > 0 ? (
                images.map((img, index) => {
                    // Decide what text to show
                    let sectionTitle = "";
                    let sectionText = img.caption || `A detailed look into the visual storytelling of ${project.title}.`;

                    if (index === 0 && project.problem_statement) {
                        sectionTitle = "The Challenge";
                        sectionText = project.problem_statement;
                    } else if (index === 1 && project.solution) {
                        sectionTitle = "The Solution";
                        sectionText = project.solution;
                    } else if (index === 2 && project.outcome) {
                        sectionTitle = "The Outcome";
                        sectionText = project.outcome;
                    }

                    return (
                        <ContentSection
                            key={img.id}
                            title={sectionTitle}
                            text={sectionText}
                            image={img.image_url}
                            reverse={index % 2 !== 0}
                        />
                    );
                })
            ) : (
                // Fallback for text-only case studies (no gallery images)
                storyParts.length > 0 ? (
                    storyParts.map((part, index) => (
                        <ContentSection
                            key={index}
                            title={part.title}
                            text={part.text}
                            image={null}
                            reverse={index % 2 !== 0}
                        />
                    ))
                ) : (
                    <div className="container" style={{ padding: '150px 0', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '3rem', opacity: 0.2 }}>Case study content coming soon</h2>
                    </div>
                )
            )}

            {/* Footer CTA */}
            <div style={{ padding: '150px 0', textAlign: 'center', background: '#000' }}>
                <h2 style={{ fontSize: '4rem', marginBottom: '40px' }}>Let's talk about <br /> your next project.</h2>
                <a href="/contact" className="btn" style={{ fontSize: '1.2rem', padding: '20px 50px', borderRadius: '50px' }}>Get in Touch</a>
            </div>
        </div>
    );
};

export default CaseStudy;
