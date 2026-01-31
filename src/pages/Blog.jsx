import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Blog = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        api.get('/blogs').then(res => setPosts(res.data)).catch(console.error);
    }, []);

    return (
        <div className="container" style={{ paddingTop: '120px' }}>
            <h1 style={{ marginBottom: '40px' }}>Insights</h1>
            <div style={{ display: 'grid', gap: '40px', maxWidth: '800px' }}>
                {posts.map(post => (
                    <div key={post.id} style={{ borderBottom: '1px solid #333', paddingBottom: '40px' }}>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(post.created_at).toLocaleDateString()}</span>
                        <h2 style={{ margin: '10px 0' }}>{post.title}</h2>
                        <p style={{ color: '#ccc', marginBottom: '20px' }}>{post.summary}</p>
                        <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '20px' }}>Read More</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
