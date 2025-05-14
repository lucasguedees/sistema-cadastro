// Verifica se o usuário está autenticado
function checkAuth() {
    try {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        console.log('Página atual:', currentPage);
        console.log('Usuário autenticado:', isLoggedIn);
        
        // Se estiver na página de login e já estiver logado, redireciona para cadastro
        if ((currentPage === 'index.html' || currentPage === '') && isLoggedIn) {
            console.log('Redirecionando para cadastro.html');
            window.location.href = 'cadastro.html';
        }
        // Se não estiver na página de login e não estiver logado, redireciona para login
        else if (currentPage !== 'index.html' && !isLoggedIn) {
            console.log('Redirecionando para login');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Em caso de erro, redireciona para a página de login
        if (window.location.pathname.split('/').pop() !== 'index.html') {
            window.location.href = 'index.html';
        }
    }
}

// Função de login
function login(username, password) {
    // Credenciais fixas conforme solicitado
    if (username === 'admin' && password === 'admin*') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'cadastro.html';
        return true;
    } else {
        document.getElementById('error-message').textContent = 'Usuário ou senha inválidos';
        return false;
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// Event listener para o formulário de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // Verifica autenticação em todas as páginas
    checkAuth();
});
