import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (isRegister) {
                // Register logic
                await api.post('/auth/register', { username, email, password });
                setMessage('Account created! Please login.');
                setIsRegister(false);
                setUsername('');
                setPassword('');
            } else {
                // Login logic
                const res = await api.post('/auth/login', { email, password });
                localStorage.setItem('token', res.data.token);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="container" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{isRegister ? 'Admin Register' : 'Admin Login'}</h2>

                {error && <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}
                {message && <p style={{ color: 'green', marginBottom: '20px', textAlign: 'center' }}>{message}</p>}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Username"
                            style={{ width: '100%', padding: '12px', marginBottom: '20px', background: 'transparent', border: '1px solid #555', color: 'white' }}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        style={{ width: '100%', padding: '12px', marginBottom: '20px', background: 'transparent', border: '1px solid #555', color: 'white' }}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        style={{ width: '100%', padding: '12px', marginBottom: '20px', background: 'transparent', border: '1px solid #555', color: 'white' }}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn" style={{ width: '100%' }}>
                        {isRegister ? 'Create Account' : 'Login'}
                    </button>
                </form>

                <p
                    style={{ marginTop: '20px', textAlign: 'center', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        setIsRegister(!isRegister);
                        setError('');
                        setMessage('');
                    }}
                >
                    {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                </p>
            </div>
        </div>
    );
};

export default Login;
