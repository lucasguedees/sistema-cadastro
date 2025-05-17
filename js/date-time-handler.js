document.addEventListener('DOMContentLoaded', function() {
    // Verifica se é um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Função para formatar a data no padrão DD/MM/YYYY
        function formatarDataParaInput(data) {
            if (!data) return '';
            const [year, month, day] = data.split('-');
            return `${day}/${month}/${year}`;
        }

        // Função para converter do formato DD/MM/YYYY para YYYY-MM-DD
        function formatarDataParaSalvar(data) {
            if (!data) return '';
            const [day, month, year] = data.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }

        // Função para formatar hora no padrão HH:MM
        function formatarHoraParaInput(hora) {
            if (!hora) return '';
            return hora.substring(0, 5); // Remove os segundos se existirem
        }

        // Configura os campos de data
        function configurarCampoData(input) {
            const originalType = input.type;
            input.type = 'text';
            input.pattern = '\\d{2}/\\d{2}/\\d{4}';
            input.placeholder = 'DD/MM/AAAA';
            
            // Formata o valor inicial se existir
            if (input.value) {
                input.value = formatarDataParaInput(input.value);
            }
            
            // Adiciona máscara de data
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2);
                }
                if (value.length > 5) {
                    value = value.substring(0, 5) + '/' + value.substring(5, 9);
                }
                e.target.value = value.substring(0, 10);
                
                // Atualiza o valor original para o formulário
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = input.name || '';
                hiddenInput.value = formatarDataParaSalvar(e.target.value);
                
                // Remove o input hidden anterior se existir
                const existingHidden = input.parentNode.querySelector('input[type="hidden"]');
                if (existingHidden) {
                    input.parentNode.removeChild(existingHidden);
                }
                
                input.parentNode.appendChild(hiddenInput);
            });
        }
        
        // Configura os campos de hora
        function configurarCampoHora(input) {
            const originalType = input.type;
            input.type = 'text';
            input.pattern = '\\d{2}:\\d{2}';
            input.placeholder = 'HH:MM';
            
            // Formata o valor inicial se existir
            if (input.value) {
                input.value = formatarHoraParaInput(input.value);
            }
            
            // Adiciona máscara de hora
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) {
                    value = value.substring(0, 2) + ':' + value.substring(2, 4);
                }
                e.target.value = value.substring(0, 5);
                
                // Atualiza o valor original para o formulário
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = input.name || '';
                hiddenInput.value = e.target.value + ':00'; // Adiciona segundos para o formato time
                
                // Remove o input hidden anterior se existir
                const existingHidden = input.parentNode.querySelector('input[type="hidden"]');
                if (existingHidden) {
                    input.parentNode.removeChild(existingHidden);
                }
                
                input.parentNode.appendChild(hiddenInput);
            });
        }
        
        // Configura todos os campos de data
        document.querySelectorAll('input[type="date"]').forEach(input => {
            configurarCampoData(input);
        });
        
        // Configura todos os campos de hora
        document.querySelectorAll('input[type="time"]').forEach(input => {
            configurarCampoHora(input);
        });
        
        // Configura os campos de data que são adicionados dinamicamente
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Verifica se é um elemento
                        const dateInputs = node.querySelectorAll ? 
                            node.querySelectorAll('input[type="date"]') : [];
                        const timeInputs = node.querySelectorAll ? 
                            node.querySelectorAll('input[type="time"]') : [];
                            
                        dateInputs.forEach(input => configurarCampoData(input));
                        timeInputs.forEach(input => configurarCampoHora(input));
                    }
                });
            });
        });
        
        // Observa alterações no documento para campos adicionados dinamicamente
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
});
