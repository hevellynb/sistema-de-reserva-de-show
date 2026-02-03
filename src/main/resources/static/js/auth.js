document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, senha: senha }) 
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role); 
            localStorage.setItem('userId', data.userId);
            alert('Login realizado com sucesso!');
            if (data.role === 'ADMIN' || data.role === 'ROLE_ADMIN') {
                window.location.href = 'pages/admin.html';
            } else {
                window.location.href = 'pages/dashboard.html';
            }
        } else {
            alert('Erro: Usuário ou senha inválidos');
        }
    } catch (error) {
        console.error('Erro na conexão:', error);
        alert('Não foi possível conectar ao servidor.');
    }
});