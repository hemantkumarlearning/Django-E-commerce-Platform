const API_BASE = CONFIG.BASE_URL

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        alert('Username and password are required');
        return;
    }

    try {
       
        const loginRes = await fetch(`${API_BASE}/api-token-auth/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!loginRes.ok) {
            const err = await loginRes.json();
            alert(err.non_field_errors?.[0] || 'Login failed');
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        localStorage.setItem('Token', token);

        
        const userRes = await fetch(`${API_BASE}/api/user/`, {
            headers: { 'Authorization': `Token ${token}` }
        });

        if (!userRes.ok) {
            alert('Failed to fetch user info');
            return;
        }

        const userData = await userRes.json();
        localStorage.setItem('is_staff', userData.is_staff);

       
        if (userData.is_staff) {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'products.html';
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
});
