const API_URL = 'http://localhost:8080';

async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '../index.html';
        return;
    }

    return response;
}