import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// --- Sub-components (Managers) moved outside to prevent remounting on setiap render ---

const ProjectsManager = ({ projects, fetchData }) => {
    const [formData, setFormData] = useState({ title: '', slug: '', category: 'UI/UX Design', summary: '', problem_statement: '', solution: '', outcome: '', content_md: '', is_featured: false });
    const [hero, setHero] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [showGalleryManager, setShowGalleryManager] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (hero) data.append('hero_image', hero);
        if (gallery.length > 0) {
            Array.from(gallery).forEach(file => data.append('gallery_images', file));
        }
        try {
            await api.post('/case-studies', data);
            alert('Project Created');
            setShowCreateForm(false);
            fetchData();
        } catch (err) { alert('Error creating project'); }
    };

    const GalleryManager = ({ project }) => {
        const [captions, setCaptions] = useState({});

        const updateCaption = async (imageId) => {
            await api.patch(`/case-studies/images/${imageId}`, { caption: captions[imageId] });
            alert('Caption updated');
            fetchData();
        };

        const deleteImage = async (imageId) => {
            if (confirm('Delete this image?')) {
                await api.delete(`/case-studies/images/${imageId}`);
                fetchData();
            }
        };

        return (
            <div className="glass-card" style={{ padding: '20px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h4>Manage Gallery: {project.title}</h4>
                    <button onClick={() => setShowGalleryManager(null)} className="btn" style={{ padding: '5px 15px' }}>Close</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                    {project.images?.map(img => (
                        <div key={img.id} style={{ border: '1px solid #333', padding: '10px', borderRadius: '8px' }}>
                            <img src={img.image_url} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                            <input
                                placeholder="Image description..."
                                defaultValue={img.caption}
                                onBlur={(e) => setCaptions({ ...captions, [img.id]: e.target.value })}
                                style={{ width: '100%', marginTop: '10px', padding: '5px', background: '#000', border: '1px solid #333', color: 'white', fontSize: '0.8rem' }}
                            />
                            <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                                <button onClick={() => updateCaption(img.id)} style={{ flex: 1, fontSize: '0.7rem' }} className="btn">Save</button>
                                <button onClick={() => deleteImage(img.id)} style={{ background: '#331111', color: '#ff4444', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Manage Case Studies</h3>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn">{showCreateForm ? 'Cancel' : 'Add New Project'}</button>
            </div>
            {showCreateForm && (
                <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px', padding: '25px' }}>
                    <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
                    <input placeholder="Slug" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        required
                        style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                    >
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Logo Design">Logo Design</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Brand Identity">Brand Identity</option>
                        <option value="Web Design">Web Design</option>
                    </select>
                    <textarea placeholder="Summary" value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', gridColumn: 'span 2' }} />

                    {formData.category === 'UI/UX Design' && (
                        <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            <textarea placeholder="Problem / Challenge" value={formData.problem_statement} onChange={e => setFormData({ ...formData, problem_statement: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', minHeight: '120px' }} />
                            <textarea placeholder="The Solution" value={formData.solution} onChange={e => setFormData({ ...formData, solution: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', minHeight: '120px' }} />
                            <textarea placeholder="The Outcome" value={formData.outcome} onChange={e => setFormData({ ...formData, outcome: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', minHeight: '120px' }} />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#888' }}>Main Hero (Thumbnail)</label>
                        <input type="file" onChange={e => setHero(e.target.files[0])} style={{ padding: '10px', background: '#1a1a1a', borderRadius: '8px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#888' }}>Process Gallery (Multiple)</label>
                        <input type="file" multiple onChange={e => setGallery(e.target.files)} style={{ padding: '10px', background: '#1a1a1a', borderRadius: '8px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: 'span 2', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <label htmlFor="is_featured" style={{ cursor: 'pointer', fontWeight: '600' }}>Showcase in Selective Works (Homepage Top)</label>
                    </div>
                    <button type="submit" className="btn" style={{ gridColumn: 'span 2', marginTop: '10px' }}>Create Project</button>
                </form>
            )}
            {showGalleryManager && <GalleryManager project={showGalleryManager} />}

            {
                editingProject && (
                    <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', border: '1px solid var(--accent-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h4>Edit Project: {editingProject.title}</h4>
                            <button onClick={() => setEditingProject(null)} className="btn">Cancel</button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await api.put(`/case-studies/${editingProject.id}`, editingProject);
                                alert('Project Updated');
                                setEditingProject(null);
                                fetchData();
                            } catch (err) { alert('Error updating project'); }
                        }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input placeholder="Title" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} required style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
                            <input placeholder="Slug" value={editingProject.slug} onChange={e => setEditingProject({ ...editingProject, slug: e.target.value })} required style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
                            <select
                                value={editingProject.category}
                                onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                                required
                                style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px' }}
                            >
                                <option value="UI/UX Design">UI/UX Design</option>
                                <option value="Logo Design">Logo Design</option>
                                <option value="Graphic Design">Graphic Design</option>
                                <option value="Brand Identity">Brand Identity</option>
                                <option value="Web Design">Web Design</option>
                            </select>
                            <textarea placeholder="Summary" value={editingProject.summary} onChange={e => setEditingProject({ ...editingProject, summary: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', gridColumn: 'span 2' }} />

                            {editingProject.category === 'UI/UX Design' && (
                                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                    <textarea placeholder="Problem" value={editingProject.problem_statement} onChange={e => setEditingProject({ ...editingProject, problem_statement: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', minHeight: '100px' }} />
                                    <textarea placeholder="Solution" value={editingProject.solution} onChange={e => setEditingProject({ ...editingProject, solution: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', minHeight: '100px' }} />
                                    <textarea placeholder="Outcome" value={editingProject.outcome} onChange={e => setEditingProject({ ...editingProject, outcome: e.target.value })} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', minHeight: '100px' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: 'span 2', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginTop: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="edit_is_featured"
                                    checked={editingProject.is_featured}
                                    onChange={e => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <label htmlFor="edit_is_featured" style={{ cursor: 'pointer', fontWeight: '600' }}>Showcase in Selective Works (Homepage Top)</label>
                            </div>

                            <button type="submit" className="btn" style={{ gridColumn: 'span 2', marginTop: '10px' }}>Save Changes</button>
                        </form>
                    </div>
                )
            }

            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: '1px solid #333' }}><th style={{ padding: '10px' }}>Image</th><th style={{ padding: '10px' }}>Title</th><th style={{ padding: '10px' }}>Action</th></tr></thead>
                <tbody>
                    {projects.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                            <td style={{ padding: '10px' }}><img src={p.hero_image_url} width="60" height="60" style={{ objectFit: 'cover', borderRadius: '4px' }} alt="" /></td>
                            <td style={{ padding: '10px' }}>{p.title}</td>
                            <td style={{ padding: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button onClick={() => setEditingProject(p)} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>Edit Details</button>
                                <button onClick={() => setShowGalleryManager(p)} style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>Manage Gallery</button>
                                <button onClick={async () => { if (confirm('Delete Project?')) { await api.delete(`/case-studies/${p.id}`); fetchData(); } }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const InsightsManager = ({ blogs, fetchData }) => {
    const [formData, setFormData] = useState({ title: '', slug: '', summary: '', content_md: '' });
    const [cover, setCover] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (cover) data.append('cover_image', cover);
        await api.post('/blogs', data);
        setShowCreateForm(false);
        fetchData();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Manage Blog Insights</h3>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn">{showCreateForm ? 'Cancel' : 'Write New Insight'}</button>
            </div>
            {showCreateForm && (
                <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                    <input placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <input placeholder="Slug" onChange={e => setFormData({ ...formData, slug: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <textarea placeholder="Summary" onChange={e => setFormData({ ...formData, summary: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <label>Cover Image: <input type="file" onChange={e => setCover(e.target.files[0])} /></label>
                    <button type="submit" className="btn">Publish Insight</button>
                </form>
            )}
            {blogs.map(b => (
                <div key={b.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '15px' }}>
                    <div><strong>{b.title}</strong></div>
                    <button onClick={async () => { if (confirm('Delete?')) { await api.delete(`/blogs/${b.id}`); fetchData(); } }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>
            ))}
        </div>
    );
};

const TestimonialsManager = ({ testimonials, fetchData }) => {
    const [formData, setFormData] = useState({ client_name: '', client_company: '', content: '', rating: 5 });
    const [logo, setLogo] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (logo) data.append('logo', logo);
        await api.post('/testimonials', data);
        setShowCreateForm(false);
        fetchData();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Client Testimonials</h3>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn">{showCreateForm ? 'Cancel' : 'Add Testimonial'}</button>
            </div>
            {showCreateForm && (
                <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                    <input placeholder="Client Name" onChange={e => setFormData({ ...formData, client_name: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <input placeholder="Company" onChange={e => setFormData({ ...formData, client_company: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <textarea placeholder="Content" onChange={e => setFormData({ ...formData, content: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <label>Client Logo: <input type="file" onChange={e => setLogo(e.target.files[0])} /></label>
                    <button type="submit" className="btn">Add Testimonial</button>
                </form>
            )}
            {testimonials.map(t => (
                <div key={t.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '15px' }}>
                    <div><strong>{t.client_name}</strong> ({t.client_company})</div>
                    <button onClick={async () => { if (confirm('Delete?')) { await api.delete(`/testimonials/${t.id}`); fetchData(); } }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>
            ))}
        </div>
    );
};

const ShowcaseManager = ({ showcase, fetchData }) => {
    const [formData, setFormData] = useState({ title: '', category: 'Logo', description: '' });
    const [media, setMedia] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        if (media) data.append('media', media);
        try {
            await api.post('/showcase', data);
            alert('Showcase Item Added');
            setShowCreateForm(false);
            fetchData();
        } catch (err) { alert('Error uploading media'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Creative Showcase</h3>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn">{showCreateForm ? 'Cancel' : 'Upload New Work'}</button>
            </div>
            {showCreateForm && (
                <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                    <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}>
                        <option value="Logo">Logo</option>
                        <option value="UI/UX">UI/UX</option>
                        <option value="Graphics">Graphics</option>
                        <option value="Video">Video</option>
                    </select>
                    <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <label>Media File (Image/Video): <input type="file" onChange={e => setMedia(e.target.files[0])} required /></label>
                    <button type="submit" className="btn">Upload</button>
                </form>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {showcase.map(item => (
                    <div key={item.id} className="glass-card" style={{ padding: '10px', position: 'relative' }}>
                        {item.media_url?.endsWith('.mp4') || item.media_url?.endsWith('.mov') ? (
                            <video src={item.media_url} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} muted />
                        ) : (
                            <img src={item.media_url} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                        )}
                        <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                            <strong>{item.title}</strong>
                            <div style={{ color: '#666', fontSize: '0.8rem' }}>{item.category}</div>
                        </div>
                        <button
                            onClick={async () => { if (confirm('Delete?')) { await api.delete(`/showcase/${item.id}`); fetchData(); } }}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '10px' }}
                        >✕</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SkillsManager = ({ skills, fetchData }) => {
    const [newSkill, setNewSkill] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        try {
            await api.post('/skills', { name: newSkill });
            setNewSkill('');
            fetchData();
        } catch (err) { alert(err.response?.data?.error || 'Error adding skill'); }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this skill?')) {
            await api.delete(`/skills/${id}`);
            fetchData();
        }
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>My Toolkit / Skills</h3>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn">{showCreateForm ? 'Cancel' : 'Add New Skill'}</button>
            </div>

            {showCreateForm && (
                <form onSubmit={handleAdd} className="glass-card" style={{ display: 'flex', gap: '15px', marginBottom: '30px', padding: '20px' }}>
                    <input
                        placeholder="Skill name (e.g. Figma, React)"
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        required
                        style={{ flex: 1, padding: '10px', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '8px' }}
                    />
                    <button type="submit" className="btn">Add Skill</button>
                </form>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {skills.map(s => (
                    <div key={s.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 15px', background: 'rgba(255,255,255,0.05)' }}>
                        <span>{s.name}</span>
                        <button
                            onClick={() => handleDelete(s.id)}
                            style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ServicesManager = ({ services, fetchData }) => {
    const [formData, setFormData] = useState({ title: '', description: '', icon_name: '' });
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/services', formData);
        setShowCreateForm(false);
        fetchData();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Offered Services</h3>
                <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn">{showCreateForm ? 'Cancel' : 'Add New Service'}</button>
            </div>
            {showCreateForm && (
                <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                    <input placeholder="Service Title" onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <textarea placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                    <button type="submit" className="btn">Add Service</button>
                </form>
            )}
            {services.map(s => (
                <div key={s.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '15px' }}>
                    <div><strong>{s.title}</strong></div>
                    <button onClick={async () => { if (confirm('Delete?')) { await api.delete(`/services/${s.id}`); fetchData(); } }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>Delete</button>
                </div>
            ))}
        </div>
    );
};

const ProfileManager = ({ settings, fetchData }) => {
    const [pSettings, setPSettings] = useState(settings);
    const [pImg, setPImg] = useState(null);
    const [resFile, setResFile] = useState(null);

    useEffect(() => {
        setPSettings(settings);
    }, [settings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(pSettings).forEach(k => {
            if (pSettings[k] !== null && pSettings[k] !== undefined) data.append(k, pSettings[k]);
        });
        if (pImg) data.append('profile_image', pImg);
        if (resFile) data.append('resume_file', resFile);
        await api.patch('/settings', data);
        alert('Settings Saved');
        fetchData();
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
            <h3>Global Portfolio Settings</h3>
            <label style={{ display: 'grid', gap: '8px' }}>Job Title
                <input value={pSettings.job_title || ''} onChange={e => setPSettings({ ...pSettings, job_title: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
            </label>
            <label style={{ display: 'grid', gap: '8px' }}>About Text
                <textarea value={pSettings.about_text || ''} onChange={e => setPSettings({ ...pSettings, about_text: e.target.value })} style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} rows="5" />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <label style={{ display: 'grid', gap: '8px' }}>Profile Photo
                    <input type="file" onChange={e => setPImg(e.target.files[0])} />
                </label>
                <label style={{ display: 'grid', gap: '8px' }}>Resume (PDF)
                    <input type="file" onChange={e => setResFile(e.target.files[0])} />
                </label>
            </div>
            <button type="submit" className="btn">Save & Publish</button>
        </form>
    );
};

// --- Main Dashboard Component ---

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [services, setServices] = useState([]);
    const [showcase, setShowcase] = useState([]);
    const [messages, setMessages] = useState([]);
    const [settings, setSettings] = useState({});
    const [skills, setSkills] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = () => {
        if (activeTab === 'projects') api.get('/case-studies').then(res => setProjects(res.data));
        if (activeTab === 'insights') api.get('/blogs').then(res => setBlogs(res.data));
        if (activeTab === 'testimonials') api.get('/testimonials').then(res => setTestimonials(res.data));
        if (activeTab === 'services') api.get('/services').then(res => setServices(res.data));
        if (activeTab === 'showcase') api.get('/showcase').then(res => setShowcase(res.data));
        if (activeTab === 'messages') api.get('/messages').then(res => setMessages(res.data));
        if (activeTab === 'profile') api.get('/settings').then(res => setSettings(res.data));
        if (activeTab === 'skills') api.get('/skills').then(res => setSkills(res.data));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ marginBottom: '5px' }}>Admin Dashboard</h1>
                    <p style={{ color: '#666' }}>Manage every aspect of your professional portfolio.</p>
                </div>
                <button onClick={handleLogout} className="btn-outline" style={{ borderRadius: '30px', padding: '10px 25px' }}>Logout</button>
            </div>

            <div style={{ marginBottom: '15px', color: 'var(--accent-color)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Command Navigation</div>
            <nav style={{ display: 'flex', gap: '15px', marginBottom: '50px', overflowX: 'auto', paddingBottom: '15px' }}>
                {['projects', 'showcase', 'skills', 'insights', 'testimonials', 'services', 'messages', 'profile'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); }}
                        style={{
                            padding: '14px 28px',
                            background: activeTab === tab ? 'var(--text-color)' : 'rgba(128,128,128,0.1)',
                            color: activeTab === tab ? 'var(--bg-color)' : 'var(--text-color)',
                            borderRadius: '50px',
                            textTransform: 'capitalize',
                            fontWeight: '700',
                            border: activeTab === tab ? 'none' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease',
                            opacity: activeTab === tab ? 1 : 0.7
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            <div className="tab-content" style={{ minHeight: '50vh', borderTop: '1px solid #222', paddingTop: '30px' }}>
                {activeTab === 'projects' && <ProjectsManager projects={projects} fetchData={fetchData} />}
                {activeTab === 'insights' && <InsightsManager blogs={blogs} fetchData={fetchData} />}
                {activeTab === 'testimonials' && <TestimonialsManager testimonials={testimonials} fetchData={fetchData} />}
                {activeTab === 'services' && <ServicesManager services={services} fetchData={fetchData} />}
                {activeTab === 'showcase' && <ShowcaseManager showcase={showcase} fetchData={fetchData} />}
                {activeTab === 'skills' && <SkillsManager skills={skills} fetchData={fetchData} />}
                {activeTab === 'profile' && <ProfileManager settings={settings} fetchData={fetchData} />}
                {activeTab === 'messages' && (
                    <div>
                        <h3>Lead Messages</h3>
                        {messages.length === 0 && <p style={{ color: '#666', marginTop: '20px' }}>No new messages yet.</p>}
                        {messages.map(m => (
                            <div key={m.id} className="glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <strong>{m.name}</strong>
                                    <span style={{ color: '#666' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                                </div>
                                <div style={{ color: 'var(--accent-color)', marginBottom: '10px', fontSize: '0.9rem' }}>{m.email} / {m.subject}</div>
                                <p style={{ color: '#aaa', lineHeight: '1.6' }}>{m.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
