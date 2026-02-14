import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Heart, Shield, Mail, Key } from 'lucide-react';

export default function Auth() {
    const { login } = useApp();
    const navigate = useNavigate();

    // Form State
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('sender'); // 'sender' or 'receiver'
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        if (isSignup && !name.trim()) return;

        setLoading(true);

        // Pass all data to context login function
        // It handles calling the backend API
        const success = await login({ email, password, name, role, isSignup });

        setLoading(false);

        if (success) {
            // Redirect based on role (persisted or new)
            // If checking existing users, we might redirect based on their stored role
            // But for simplicity, we respect the current toggle or default
            if (role === 'sender') {
                navigate('/dashboard');
            } else {
                navigate('/receiver');
            }
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center' }}>
            <motion.div
                className="glass"
                style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', width: '100%' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }}>
                        <Shield size={48} color="#a78bfa" />
                    </div>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', background: 'linear-gradient(to right, #c084fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Luna</h1>
                <p style={{ color: 'var(--moon-text-secondary)', marginBottom: '32px' }}>Safe Together. Private Always.</p>

                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', marginBottom: '24px' }}>
                    <button
                        type="button"
                        onClick={() => setIsSignup(false)}
                        style={{ flex: 1, padding: '8px', borderRadius: '6px', background: !isSignup ? 'rgba(255,255,255,0.1)' : 'transparent', color: !isSignup ? 'white' : 'var(--moon-text-secondary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsSignup(true)}
                        style={{ flex: 1, padding: '8px', borderRadius: '6px', background: isSignup ? 'rgba(255,255,255,0.1)' : 'transparent', color: isSignup ? 'white' : 'var(--moon-text-secondary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleAuth}>
                    <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--moon-text-primary)' }}>
                            Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--moon-text-secondary)' }} />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--moon-text-primary)' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--moon-text-secondary)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>

                    {isSignup && (
                        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--moon-text-primary)' }}>
                                Alias (Public Name)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Moon Child"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {isSignup && (
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                            <button
                                type="button"
                                className={`btn ${role === 'sender' ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: role === 'sender' ? 'transparent' : 'var(--moon-border)', padding: '10px' }}
                                onClick={() => setRole('sender')}
                            >
                                <Heart size={16} fill={role === 'sender' ? "white" : "none"} /> Sender
                            </button>
                            <button
                                type="button"
                                className={`btn ${role === 'receiver' ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: role === 'receiver' ? 'transparent' : 'var(--moon-border)', padding: '10px' }}
                                onClick={() => setRole('receiver')}
                            >
                                <Shield size={16} fill={role === 'receiver' ? "white" : "none"} /> Helper
                            </button>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }} disabled={loading}>
                        {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Login')}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Lock size={12} /> End-to-end encrypted & Private
                </p>
            </motion.div>
        </div>
    );
}
