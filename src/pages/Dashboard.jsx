import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, MapPin, ShieldAlert, CheckCircle,
    User, Users, UserPlus, LogOut, Search, X, Check,
    Droplet, Circle, Disc, Map, Navigation, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simple SVG icons for hygiene products
const PadIcon = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 5 6 5 12s3 10 7 10 7-6 7-10-3-10-7-10z" />
        <path d="M8 12h8" style={{ opacity: 0.5 }} />
    </svg>
);

const TamponIcon = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2h4v16h-4z" />
        <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
);

const CupIcon = ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h14v8a7 7 0 0 1-14 0V4z" />
        <line x1="12" y1="12" x2="12" y2="20" />
        <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
);

export default function Dashboard() {
    const {
        user, userAlert, cancelAlert, sendAlert, logout,
        friends, friendRequests, friendAlerts,
        searchUsers, sendFriendRequest,
        acceptFriendRequest, denyFriendRequest, removeFriend,
        simulateIncomingRequest, simulateIncomingAlert, acceptFriendAlert
    } = useApp();

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('safety'); // safety, alerts, friends, requests, search
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showProductSelection, setShowProductSelection] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (query) {
            const fetchUsers = async () => {
                const results = await searchUsers(query);
                setSearchResults(results || []);
            };
            fetchUsers();
        } else {
            setSearchResults([]);
        }
    }, [query, activeTab]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSOSClick = () => {
        setShowProductSelection(true);
    };

    const handleProductSelect = (type) => {
        sendAlert(type);
        setShowProductSelection(false);
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            {/* Header / Profile Summary */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="glass" style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139, 92, 246, 0.2)' }}>
                        <User size={24} color="#a78bfa" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user?.name || 'User'}</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--moon-text-secondary)' }}>
                            {user?.role === 'sender' ? 'User' : 'Helper'} • {friends.length} Friend{friends.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <button onClick={handleLogout} className="glass" style={{ padding: '8px', color: 'var(--moon-danger)', border: 'none', cursor: 'pointer' }}>
                    <LogOut size={20} />
                </button>
            </header>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '5px' }}>
                {[
                    { id: 'safety', icon: ShieldAlert, label: 'Safety' },
                    { id: 'alerts', icon: Bell, label: 'Alerts', count: friendAlerts.filter(a => a.status === 'pending').length },
                    { id: 'friends', icon: Users, label: 'Friends' },
                    { id: 'requests', icon: UserPlus, label: 'Requests', count: friendRequests.length },
                    { id: 'search', icon: Search, label: 'Find' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`glass`}
                        style={{
                            flex: 1,
                            minWidth: '70px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px 8px',
                            background: activeTab === tab.id ? 'rgba(124, 58, 237, 0.2)' : 'var(--moon-card)',
                            borderColor: activeTab === tab.id ? 'var(--moon-accent)' : 'transparent',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <tab.icon size={20} color={activeTab === tab.id ? '#c084fc' : '#94a3b8'} style={{ marginBottom: '4px' }} />
                        <span style={{ fontSize: '0.7rem', color: activeTab === tab.id ? '#c084fc' : '#94a3b8' }}>{tab.label}</span>
                        {tab.count > 0 && (
                            <span style={{
                                position: 'absolute', top: '5px', right: '5px',
                                background: 'var(--moon-danger)', color: 'white', fontSize: '0.6rem',
                                width: '18px', height: '18px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <main style={{ flex: 1 }}>
                <AnimatePresence mode="wait">

                    {/* SAFETY TAB */}
                    {activeTab === 'safety' && (
                        <motion.div
                            key="safety"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}
                        >
                            {(!userAlert || userAlert.status === 'cancelled') ? (
                                <>
                                    {!showProductSelection ? (
                                        <>
                                            <h3 style={{ marginBottom: '20px', color: 'var(--moon-text-secondary)' }}>Emergency?</h3>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="glass"
                                                style={{
                                                    width: '220px',
                                                    height: '220px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #be123c 0%, #881337 100%)', // Rose 700 -> 900
                                                    border: '6px solid rgba(255,255,255,0.1)',
                                                    boxShadow: '0 0 50px rgba(244, 63, 94, 0.3)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                                onClick={handleSOSClick}
                                            >
                                                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 50%)' }}></div>
                                                <Bell size={56} style={{ marginBottom: '12px', zIndex: 1 }} />
                                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', zIndex: 1 }}>SOS</span>
                                                <span style={{ fontSize: '0.85rem', opacity: 0.8, zIndex: 1 }}>Request Help</span>
                                            </motion.button>
                                        </>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="glass"
                                            style={{ padding: '30px', width: '100%', textAlign: 'center' }}
                                        >
                                            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>What do you need?</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                                {[
                                                    { id: 'Pad', icon: PadIcon, label: 'Pad' },
                                                    { id: 'Tampon', icon: TamponIcon, label: 'Tampon' },
                                                    { id: 'Cup', icon: CupIcon, label: 'Cup' },
                                                ].map(item => (
                                                    <motion.button
                                                        key={item.id}
                                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(192, 132, 252, 0.2)' }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleProductSelect(item.id)}
                                                        className="glass"
                                                        style={{
                                                            padding: '20px 10px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '10px',
                                                            cursor: 'pointer',
                                                            border: '1px solid var(--moon-border)'
                                                        }}
                                                    >
                                                        <item.icon size={32} color="#e879f9" />
                                                        <span style={{ fontSize: '0.9rem', color: 'var(--moon-text-primary)' }}>{item.label}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setShowProductSelection(false)}
                                                style={{ marginTop: '24px', background: 'transparent', border: 'none', color: 'var(--moon-text-secondary)', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                        </motion.div>
                                    )}

                                    <p style={{ marginTop: '30px', fontSize: '0.9rem', color: 'var(--moon-text-secondary)', maxWidth: '80%', textAlign: 'center' }}>
                                        This will alert your <b>{friends.length} friends</b> with your location.
                                    </p>

                                    {/* Debug Tool */}
                                    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--moon-border)', width: '100%', textAlign: 'center' }}>
                                        <button onClick={simulateIncomingRequest} style={{ fontSize: '0.75rem', color: 'var(--moon-text-secondary)', background: 'none', border: '1px dashed var(--moon-border)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                            Debug: Simulate Incoming Friend Request
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <motion.div
                                    className="glass"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{
                                        padding: '30px',
                                        textAlign: 'center',
                                        border: '1px solid var(--moon-danger)',
                                        width: '100%',
                                        boxShadow: '0 0 20px rgba(244, 63, 94, 0.2)'
                                    }}
                                >
                                    <div style={{ marginBottom: '20px' }}>
                                        <div className="ripple" style={{ width: '80px', height: '80px', background: 'rgba(244, 63, 94, 0.2)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Bell size={32} color="#f43f5e" />
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Alert Sent!</h3>
                                    <p style={{ color: 'var(--moon-text-secondary)', marginBottom: '8px' }}>
                                        Notifying {friends.length} friends...
                                    </p>
                                    <div style={{ background: 'rgba(192, 132, 252, 0.1)', padding: '8px 16px', borderRadius: '20px', display: 'inline-block', marginBottom: '20px', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
                                        <span style={{ color: '#e879f9', fontSize: '0.9rem', fontWeight: 500 }}>Requesting: {userAlert.productType || 'Help'}</span>
                                    </div>

                                    {userAlert.status === 'accepted' ? (
                                        <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                                            <p style={{ color: '#34d399', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <CheckCircle size={18} /> Help is on the way!
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ marginBottom: '20px' }}>
                                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                                <motion.div
                                                    style={{ height: '100%', background: '#f43f5e' }}
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: '100%' }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--moon-text-secondary)', marginTop: '8px' }}>Waiting for response...</p>
                                        </div>
                                    )}

                                    <button className="btn btn-secondary" onClick={cancelAlert} style={{ width: '100%', borderColor: 'var(--moon-danger)', color: 'var(--moon-danger)' }}>
                                        Cancel Alert
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ALERTS TAB (NEW) */}
                    {activeTab === 'alerts' && (
                        <motion.div
                            key="alerts"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ color: 'var(--moon-text-primary)', margin: 0 }}>Incoming Alerts</h3>
                                <button onClick={simulateIncomingAlert} style={{ fontSize: '0.75rem', color: 'var(--moon-text-secondary)', background: 'none', border: '1px dashed var(--moon-border)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                    Debug: Simulate
                                </button>
                            </div>

                            {friendAlerts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--moon-text-secondary)' }}>
                                    <Bell size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                    <p>No active alerts nearby.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {friendAlerts.map(alert => (
                                        <div key={alert.id} className="glass" style={{ padding: '20px', borderLeft: alert.status === 'pending' ? '4px solid #f43f5e' : '4px solid #34d399' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={20} color="#e2e8f0" />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>{alert.senderName}</h4>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--moon-text-secondary)', margin: 0 }}>
                                                            {alert.distance} km away • {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {alert.status === 'pending' && (
                                                    <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px' }}>URGENT</span>
                                                )}
                                            </div>

                                            <div style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: 'var(--moon-text-secondary)', fontSize: '0.9rem' }}>Needs:</span>
                                                <strong style={{ color: '#e879f9' }}>{alert.productType}</strong>
                                            </div>

                                            {alert.status === 'accepted' ? (
                                                <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>
                                                        <CheckCircle size={16} /> Accepted
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--moon-text-primary)', fontSize: '0.9rem' }}>
                                                        <Navigation size={16} color="var(--moon-text-secondary)" /> <span>{alert.location}</span>
                                                    </div>
                                                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                                        <button className="btn btn-primary" style={{ flex: 1, height: '40px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#34d399' }}>
                                                            <Navigation size={16} /> Navigate
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => acceptFriendAlert(alert.id)}
                                                    className="btn btn-primary"
                                                    style={{ width: '100%', background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)', boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)' }}
                                                >
                                                    Accept Request
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* FRIENDS TAB */}
                    {activeTab === 'friends' && (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                        >
                            <h3 style={{ marginBottom: '16px', color: 'var(--moon-text-primary)' }}>My Friends ({friends.length})</h3>

                            {friends.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--moon-text-secondary)' }}>
                                    <Users size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                    <p>No friends yet.</p>
                                    <button
                                        onClick={() => setActiveTab('search')}
                                        style={{ marginTop: '10px', color: '#c084fc', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                                    >
                                        Find people to add
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {friends.map(friend => (
                                        <div key={friend.id} className="glass" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#cbd5e1' }}>{friend.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 500 }}>{friend.name}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--moon-text-secondary)' }}>{friend.role}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFriend(friend.id)}
                                                style={{ padding: '6px', color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                <LogOut size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* REQUESTS TAB */}
                    {activeTab === 'requests' && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                        >
                            <h3 style={{ marginBottom: '16px', color: 'var(--moon-text-primary)' }}>Friend Requests ({friendRequests.length})</h3>
                            {friendRequests.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--moon-text-secondary)' }}>
                                    <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                    <p>No pending requests.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {friendRequests.map(req => (
                                        <div key={req.id} className="glass" style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={20} color="#c084fc" />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 500 }}>{req.senderName}</p>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--moon-text-secondary)' }}>wants to be your friend</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => acceptFriendRequest(req.id)}
                                                    className="btn btn-primary"
                                                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => denyFriendRequest(req.id)}
                                                    className="btn btn-secondary"
                                                    style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                                                >
                                                    Deny
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* SEARCH TAB */}
                    {activeTab === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                        >
                            <h3 style={{ marginBottom: '16px', color: 'var(--moon-text-primary)' }}>Find Friends</h3>
                            <div style={{ position: 'relative', marginBottom: '20px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--moon-text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    style={{ width: '100%', paddingLeft: '40px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {searchResults.map(u => (
                                    <div key={u.id} className="glass" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{u.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{u.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--moon-text-secondary)' }}>{u.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                sendFriendRequest(u);
                                                setQuery(''); // clear search after adding
                                            }}
                                            style={{
                                                background: '#7c3aed', color: 'white', border: 'none',
                                                borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                                {query && searchResults.length === 0 && (
                                    <p style={{ textAlign: 'center', color: 'var(--moon-text-secondary)', fontSize: '0.9rem' }}>No users found.</p>
                                )}
                                {!query && (
                                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Try searching for "Alice" or "Bob"</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}
