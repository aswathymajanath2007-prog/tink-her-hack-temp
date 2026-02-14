import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Map, Navigation, User, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Receiver() {
    const { user, friendAlerts, acceptFriendAlert } = useApp();

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingTop: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Receiver Mode</h2>
                    <p style={{ color: 'var(--moon-text-secondary)' }}>Scanning for alerts...</p>
                </div>
                <div className="glass" style={{ padding: '8px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.2)' }}>
                    <ShieldCheck color="#34d399" />
                </div>
            </header>

            {/* Mock Map View */}
            <div className="glass" style={{ height: '300px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <Map size={48} color="var(--moon-text-secondary)" style={{ opacity: 0.5 }} />
                <span style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.8rem', background: 'var(--moon-card)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--moon-border)' }}>Mock Map View</span>

                {/* Radar Effect */}
                <motion.div
                    style={{ position: 'absolute', width: '200px', height: '200px', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '50%' }}
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Nearby Alerts ({friendAlerts.length})</h3>

            {friendAlerts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {friendAlerts.map(alert => (
                        <motion.div
                            key={alert.id}
                            className="glass"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            style={{ padding: '20px', borderLeft: alert.status === 'pending' ? '4px solid #f43f5e' : '4px solid #34d399' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{alert.senderName}</h4>
                                    <p style={{ color: 'var(--moon-text-secondary)', fontSize: '0.9rem' }}>~{alert.distance} km away • {new Date(alert.timestamp).toLocaleTimeString()}</p>
                                </div>
                                {alert.status === 'pending' && (
                                    <div style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                        URGENT
                                    </div>
                                )}
                            </div>

                            <div style={{ background: 'rgba(192, 132, 252, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--moon-text-secondary)' }}>Needs:</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#e879f9' }}>{alert.productType || 'General Help'}</span>
                            </div>

                            {alert.status === 'accepted' ? (
                                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px' }}>
                                    <p style={{ marginBottom: '8px', fontWeight: 600 }}>Details Revealed:</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <User size={16} color="var(--moon-text-secondary)" /> <span>{alert.senderName}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Navigation size={16} color="var(--moon-text-secondary)" /> <span>{alert.location}</span>
                                    </div>
                                    <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#34d399' }}>
                                        <CheckCircle size={14} /> You have accepted this request.
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--moon-text-secondary)', marginBottom: '16px' }}>
                                        Accept to see location and contact details.
                                    </p>
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => acceptFriendAlert(alert.id)}>
                                        Accept Request
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--moon-text-secondary)' }}>
                    <p>No active alerts from friends.</p>
                </div>
            )}

        </div>
    );
}
