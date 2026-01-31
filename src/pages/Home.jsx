import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
    const [featuredCases, setFeaturedCases] = useState([]);
    const [services, setServices] = useState([]);
    const [showcase, setShowcase] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [casesRes, servicesRes, settingsRes] = await Promise.all([
                    api.get('/case-studies'),
                    api.get('/services'),
                    api.get('/settings')
                ]);

                const allCases = casesRes.data;
                setFeaturedCases(allCases.filter(p => p.is_featured));
                setServices(servicesRes.data);
                setSettings(settingsRes.data);

                // Fetch creative showcase and merge with ALL cases (as requested)
                fetchMergedShowcase(activeCategory, allCases);
            } catch (err) { console.error(err); }
        };
        loadInitialData();
    }, []);

    const fetchMergedShowcase = async (category, allCases) => {
        try {
            const creativeRes = await api.get(`/showcase?category=${category}`);
            const creativeItems = creativeRes.data.map(item => ({ ...item, isProject: false }));

            // Map ALL cases to same format, matching category intelligently
            const caseItems = allCases
                .filter(p => {
                    if (category === 'All') return true;
                    const cat = category.toLowerCase();
                    const pCat = p.category.toLowerCase();
                    // Match 'UI/UX' to 'UI/UX Design', 'Logo' to 'Logo Design', 'Graphics' to 'Graphic Design'
                    if (cat === 'ui/ux' && pCat.includes('ui/ux')) return true;
                    if (cat === 'logo' && pCat.includes('logo')) return true;
                    if (cat === 'graphics' && pCat.includes('graphic')) return true;
                    if (cat === 'video' && pCat.includes('video')) return true;
                    return pCat.includes(cat);
                })
                .map(p => ({
                    id: `project-${p.id}`,
                    title: p.title,
                    category: p.category,
                    media_url: p.hero_image_url,
                    slug: p.slug,
                    isProject: true
                }));

            setShowcase([...caseItems, ...creativeItems]);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        api.get('/case-studies').then(res => {
            const allCases = res.data;
            setFeaturedCases(allCases.filter(p => p.is_featured));
            fetchMergedShowcase(activeCategory, allCases);
        });
    }, [activeCategory]);

    const categories = ['All', 'Logo', 'UI/UX', 'Graphics', 'Video'];

    return (
        <div className="home" style={{ position: 'relative', background: '#0b0b0b', minHeight: '100vh', color: 'white' }}>
            {/* Hero Section */}
            <section className="hero container" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '80px' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '60px',
                    width: '100%'
                }}>
                    {/* Left Column: Text Content */}
                    <div style={{ flex: '1.2', minWidth: '320px' }}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            style={{ color: 'var(--accent-color)', fontWeight: '600', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '20px' }}
                        >
                            {settings.job_title || 'Visual Designer'}
                        </motion.span>

                        <div className="text-mask" style={{ overflow: 'hidden' }}>
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.6, 0.01, -0.05, 0.95] }}
                                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: '0.9', margin: '0 0 30px 0', letterSpacing: '-2px' }}
                            >
                                Crafting digital <br />
                                <span style={{ color: 'rgba(255,255,255,0.3)' }}>experiences.</span>
                            </motion.h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            style={{ maxWidth: '500px', fontSize: '1.2rem', color: '#888', marginBottom: '40px', lineHeight: '1.6' }}
                        >
                            {(settings.about_text && typeof settings.about_text === 'string') ? (settings.about_text.substring(0, 150) + '...') : 'I help brands build high-end digital products through human-centered design systems and strategy.'}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            style={{ display: 'flex', gap: '30px' }}
                        >
                            <Link to="/portfolio" className="btn" style={{ borderRadius: '50px', padding: '16px 32px' }}>View Projects</Link>
                            <Link to="/contact" style={{ display: 'flex', alignItems: 'center', fontWeight: '600', color: 'white' }}>Contact Me →</Link>
                        </motion.div>
                    </div>

                    {/* Right Column: Illustration */}
                    <motion.div
                        initial={{ opacity: 1, scale: 1, x: 0 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            flex: '0.8',
                            minWidth: '320px',
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        {/* Decorative blob background */}
                        <div style={{
                            position: 'absolute',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)',
                            opacity: 0.2,
                            filter: 'blur(60px)',
                            zIndex: -1,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}></div>

                        <img
                            src="/assets/hero-illustration.png"
                            alt="UX Designer Illustration"
                            style={{
                                width: '100%',
                                maxWidth: '550px',
                                height: 'auto',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
                                display: 'block'
                            }}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Dynamic Marquee */}
            <div style={{
                width: '100%',
                overflow: 'hidden',
                background: 'white',
                color: 'black',
                padding: '25px 0',
                display: 'flex',
                whiteSpace: 'nowrap',
                fontWeight: '900',
                fontSize: '3.5rem',
                textTransform: 'uppercase',
                margin: '120px 0'
            }}>
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    style={{ flexShrink: 0, display: 'flex', gap: '60px' }}
                >
                    <span>Available for Work • Crafting Experiences • UI/UX Design • Product Strategy • Based in London • </span>
                    <span>Available for Work • Crafting Experiences • UI/UX Design • Product Strategy • Based in London • </span>
                </motion.div>
            </div>

            {/* Featured Work */}
            <section className="container" style={{ paddingBottom: '120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '3.5rem', letterSpacing: '-2px', margin: 0 }}>Selective Works</h2>
                    <Link to="/portfolio" style={{ fontSize: '1.1rem', color: 'var(--accent-color)', fontWeight: '600' }}>Explore All Projects ↗</Link>
                </div>

                <div className="case-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '80px' }}>
                    {featuredCases.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <Link to={`/portfolio/${project.slug}`}>
                                <motion.div
                                    whileHover={{ scale: 0.98 }}
                                    transition={{ duration: 0.6, ease: [0.6, 0.01, -0.05, 0.95] }}
                                    style={{ height: '550px', backgroundColor: 'var(--secondary-bg)', borderRadius: '24px', overflow: 'hidden', marginBottom: '30px', border: '1px solid var(--border-color)' }}
                                >
                                    {project.hero_image_url ? (
                                        <img src={project.hero_image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', fontSize: '3rem', fontWeight: '800' }}>WORK</div>
                                    )}
                                </motion.div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '2rem', margin: 0 }}>{project.title}</h3>
                                    <span style={{ color: '#666', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{project.category}</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Creative Showcase Section */}
            <section className="container" style={{ paddingBottom: '150px' }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '3.5rem', letterSpacing: '-2px', marginBottom: '20px' }}>Creative Showcase</h2>
                    <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
                        A curated collection of my logos, UI experiments, motion graphics, and more.
                    </p>

                    {/* Category Filter */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '10px 25px',
                                    borderRadius: '50px',
                                    border: '1px solid #333',
                                    background: activeCategory === cat ? 'white' : 'transparent',
                                    color: activeCategory === cat ? 'black' : 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                    {showcase.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card"
                            style={{ overflow: 'hidden', padding: '15px' }}
                        >
                            {item.isProject ? (
                                <Link to={`/portfolio/${item.slug}`}>
                                    <div style={{ height: '350px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', background: '#111' }}>
                                        <img
                                            src={item.media_url}
                                            alt={item.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>{item.title}</h4>
                                        <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                                    </div>
                                </Link>
                            ) : (
                                <>
                                    <div style={{ height: '350px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', background: '#111' }}>
                                        {item.media_url.endsWith('.mp4') || item.media_url.endsWith('.mov') ? (
                                            <video
                                                src={item.media_url}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                autoPlay loop muted playsInline
                                            />
                                        ) : (
                                            <img
                                                src={item.media_url}
                                                alt={item.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                                                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                            />
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{item.title}</h4>
                                        <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</span>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                {showcase.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px', background: '#111', borderRadius: '24px' }}>
                        <p style={{ color: '#444', fontSize: '1.2rem' }}>No items found in this category yet. Stay tuned!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
