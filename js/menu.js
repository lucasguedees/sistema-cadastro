document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const sidebar = document.querySelector('.sidebar');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuItems = document.querySelectorAll('.menu-item');
    const releaseLink = document.getElementById('releaseLink');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Marcar item ativo com base na URL atual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage.includes('release') && href.includes('release'))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Abrir menu
    function openMenu() {
        document.body.classList.add('menu-open');
        sidebar.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Fechar menu
    function closeMenuHandler() {
        document.body.classList.remove('menu-open');
        sidebar.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            openMenu();
        });
    }


    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuHandler);
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Aqui você pode adicionar a lógica de logout, como limpar o localStorage, etc.
            // Por exemplo:
            // localStorage.removeItem('token');
            // window.location.href = 'login.html';
            
            // Por enquanto, apenas mostra um alerta
            if (confirm('Tem certeza que deseja sair?')) {
                // Redireciona para a página de login ou página inicial
                window.location.href = 'index.html';
            }
        });
    }

    // Fechar menu ao clicar no overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenuHandler);
    }

    // Fechar menu ao clicar em um item do menu
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                return;
            }
            // Adiciona um pequeno atraso para permitir a transição
            setTimeout(closeMenuHandler, 200);
        });
    });

    // Lidar com o link de release
    if (releaseLink) {
        releaseLink.addEventListener('click', function(e) {
            // Não é necessário prevenir o comportamento padrão
            // O link já está configurado para navegar para release.html
            // Fechar o menu após o clique
            closeMenuHandler();
        });
    }


    // Fechar menu ao pressionar a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMenuHandler();
        }
    });

    // Animar itens do menu quando o menu é aberto
    function animateMenuItems() {
        const items = document.querySelectorAll('.menu-item');
        items.forEach((item, index) => {
            item.style.animation = `slideInLeft 0.3s ease forwards ${index * 0.1}s`;
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        });
    }

    // Resetar animações quando o menu é fechado
    function resetMenuItems() {
        const items = document.querySelectorAll('.menu-item');
        items.forEach(item => {
            item.style.animation = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
    }

    // Observar mudanças no menu
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (mutation.target.classList.contains('active')) {
                    animateMenuItems();
                } else {
                    resetMenuItems();
                }
            }
        });
    });

    // Iniciar observação do menu
    if (sidebar) {
        observer.observe(sidebar, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
