document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Verificar preferência salva ou usar tema do sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema salvo ou preferência do sistema
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Alternar tema ao clicar no botão
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Atualizar ícone
        const isDark = document.body.classList.contains('dark-theme');
        themeIcon.classList.toggle('fa-moon', !isDark);
        themeIcon.classList.toggle('fa-sun', isDark);
        
        // Salvar preferência
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Atualizar tema quando a preferência do sistema mudar
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Só muda se o usuário não tiver uma preferência salva
            const isDark = e.matches;
            document.body.classList.toggle('dark-theme', isDark);
            themeIcon.classList.toggle('fa-moon', !isDark);
            themeIcon.classList.toggle('fa-sun', isDark);
        }
    });
});
