const API_BASE = 'http://127.0.0.1:8000/api';

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim()
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;

    const payload = {
            username,
            password,
            email
    };
    const res = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Registered successfully! You can now log in.');
        window.location.href = 'login.html';
    } else {
        alert('Registration failed');
    }
});
