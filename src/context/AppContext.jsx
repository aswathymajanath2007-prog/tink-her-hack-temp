import { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { id, name, role: 'sender' | 'receiver' }
    const [userAlert, setUserAlert] = useState(null); // Alert sent BY the user
    const [friendAlerts, setFriendAlerts] = useState([]); // Alerts received FROM friends
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);

    const API_URL = 'http://localhost:5000/api';

    // Helper for fetch
    const apiCall = async (endpoint, method = 'GET', body = null) => {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        };
        try {
            const res = await fetch(`${API_URL}${endpoint}`, options);
            if (!res.ok) throw new Error('API Error');
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // Load initial data if logged in
    useEffect(() => {
        if (user) {
            refreshData();
            // Poll for alerts every 5s (Simple "Realtime" for now)
            const interval = setInterval(fetchAlerts, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const refreshData = async () => {
        if (!user) return;

        // Fetch Friends
        const friendsData = await apiCall(`/friends/${user.id}`);
        if (friendsData) setFriends(friendsData);

        // Fetch Requests
        const requestsData = await apiCall(`/friends/requests/${user.id}`);
        if (requestsData) setFriendRequests(requestsData);

        fetchAlerts();
    };

    const fetchAlerts = async () => {
        // Fetch User's Active Alert (if any)
        // Fetch Friend Alerts
        const activeAlerts = await apiCall('/alerts/active');
        if (activeAlerts) {
            // Split into user's alert vs others
            const myAlert = activeAlerts.find(a => a.senderId === user.id);
            const others = activeAlerts.filter(a => a.senderId !== user.id);

            setUserAlert(myAlert || null);
            setFriendAlerts(others);
        }
    };

    // Auth
    const login = async ({ email, password, name, role, isSignup }) => {
        let res;

        if (isSignup) {
            res = await apiCall('/auth/signup', 'POST', { email, password, name, role });
        } else {
            res = await apiCall('/auth/login', 'POST', { email, password });
        }

        if (res && (res.user || res.session)) {
            // If login, user might be nested in session or top level depending on supabase response structure wrapped by our API
            // Our API returns { session, user } for login, and { message, user } for signup
            const userData = res.user; // User profile/details

            if (userData) {
                // Ensure we have role. If logging in, role comes from profile
                setUser({
                    id: userData.id,
                    name: userData.name || name || 'Anonymous',
                    role: userData.role || role || 'sender'
                });

                setUserAlert(null);
                setFriendAlerts([]);
                return true;
            }
        }

        alert('Authentication failed: ' + (res?.error || 'Check credentials'));
        return false;
    };

    const logout = () => {
        setUser(null);
        setFriends([]);
        setFriendRequests([]);
        setUserAlert(null);
        setFriendAlerts([]);
    };

    // Friend System Logic
    const searchUsers = async (query) => {
        return await apiCall(`/users/search?q=${query}&userId=${user?.id}`) || [];
    };

    const sendFriendRequest = async (toUser) => {
        const res = await apiCall('/friends/request', 'POST', { fromUserId: user.id, toUserId: toUser.id });
        if (res && !res.error) {
            alert('Request sent!');
        } else {
            alert('Failed to send request');
        }
    };

    const acceptFriendRequest = async (requestId) => {
        const res = await apiCall(`/friends/accept/${requestId}`, 'PUT');
        if (res && !res.error) {
            refreshData();
        }
    };

    const denyFriendRequest = (requestId) => {
        // Implement delete/reject API if needed
        setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const removeFriend = (friendId) => {
        // Implement remove API
        setFriends(prev => prev.filter(f => f.id !== friendId));
    };

    const simulateIncomingRequest = () => {
        alert("Use backend to generate real requests now!");
    };

    const simulateIncomingAlert = () => {
        alert("Use backend to generate real alerts now!");
    };


    // Mock sending an alert - NOW RESTRICTED TO FRIENDS
    const sendAlert = async (productType) => {
        const res = await apiCall('/alerts', 'POST', {
            sender_id: user.id,
            product_type: productType,
            latitude: 40.7128, // Mock location
            longitude: -74.0060
        });

        if (res && !res.error) {
            fetchAlerts();
        }
    };

    // Accept an incoming alert
    const acceptFriendAlert = async (alertId) => {
        const res = await apiCall(`/alerts/${alertId}/accept`, 'PUT', { helperId: user.id });
        if (res && !res.error) {
            fetchAlerts();
        }
    };

    const cancelAlert = async () => {
        if (userAlert) {
            await apiCall(`/alerts/${userAlert.id}/cancel`, 'PUT');
            setUserAlert(null);
        }
    };

    return (
        <AppContext.Provider value={{
            user,
            userAlert,
            friendAlerts,
            friends,
            friendRequests,
            login,
            logout,
            sendAlert,
            acceptFriendAlert, // Renamed from acceptAlert to be specific to incoming
            cancelAlert,
            searchUsers,
            sendFriendRequest,
            acceptFriendRequest,
            denyFriendRequest,
            removeFriend,
            simulateIncomingRequest,
            simulateIncomingAlert
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
