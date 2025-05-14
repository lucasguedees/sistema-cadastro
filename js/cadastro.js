// Função para validar CPF
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[\D]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    const digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
    
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) {
        return false;
    }
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    const digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
    
    return digitoVerificador2 === parseInt(cpf.charAt(10));
}

// Formata o CPF no formato 000.000.000-00
function formatarCPF(cpf) {
    // Remove tudo que não for dígito
    cpf = cpf.replace(/\D/g, '');
    
    // Aplica a formatação
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    return cpf;
}

document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const fotoInput = document.getElementById('foto');
    const fotoPreview = document.getElementById('fotoPreview');
    const cpfInput = document.getElementById('cpf');
    const orcrimSelect = document.getElementById('orcrim');
    const outroOrcrimContainer = document.getElementById('outroOrcrimContainer');
    const outroOrcrimInput = document.getElementById('outroOrcrim');
    const dataNascimentoInput = document.getElementById('dataNascimento');
    const openCalendarBtn = document.getElementById('openCalendar');
    let fotoUrl = '';
    
    // Inicializa o Flatpickr para o campo de data
    let datePicker = flatpickr(dataNascimentoInput, {
        locale: 'pt',
        dateFormat: 'd/m/Y',
        allowInput: true,
        clickOpens: false, // Desativa a abertura ao clicar no input
        onOpen: function(selectedDates, dateStr, instance) {
            // Posiciona o calendário corretamente abaixo do botão
            const calendar = instance.calendarContainer;
            const buttonRect = openCalendarBtn.getBoundingClientRect();
            calendar.style.position = 'fixed';
            calendar.style.top = (buttonRect.bottom + window.scrollY + 5) + 'px';
            calendar.style.left = buttonRect.left + 'px';
            
            // Fecha o calendário ao rolar a página
            window.addEventListener('scroll', instance._positionCalendar, true);
        },
        onClose: function(selectedDates, dateStr, instance) {
            // Remove o event listener de rolagem quando o calendário é fechado
            window.removeEventListener('scroll', instance._positionCalendar, true);
        }
    });
    
    // Abre o calendário ao clicar no botão
    if (openCalendarBtn) {
        openCalendarBtn.addEventListener('click', function() {
            datePicker.open();
        });
    }
    
    // Mostra/oculta o campo de texto para 'Outros' no ORCRIM
    if (orcrimSelect && outroOrcrimContainer) {
        orcrimSelect.addEventListener('change', function() {
            if (this.value === 'Outros') {
                outroOrcrimContainer.style.display = 'block';
                outroOrcrimInput.required = true;
            } else {
                outroOrcrimContainer.style.display = 'none';
                outroOrcrimInput.required = false;
                outroOrcrimInput.value = ''; // Limpa o valor quando escondido
            }
        });
    }
    
    // Aplica a máscara de CPF enquanto o usuário digita
    if (cpfInput) {
        const cpfError = document.getElementById('cpf-error');
        
        // Função para exibir mensagem de erro
        function mostrarErroCPF(mensagem) {
            cpfError.textContent = mensagem;
            cpfError.style.display = 'block';
            cpfInput.classList.add('input-error');
        }
        
        // Função para limpar mensagem de erro
        function limparErroCPF() {
            cpfError.textContent = '';
            cpfError.style.display = 'none';
            cpfInput.classList.remove('input-error');
        }
        
        cpfInput.addEventListener('input', function(e) {
            this.value = formatarCPF(this.value);
            // Limpa o erro quando o usuário começa a digitar
            limparErroCPF();
        });
        
        // Valida o CPF quando o campo perde o foco
        cpfInput.addEventListener('blur', function() {
            const cpf = this.value.replace(/[\D]/g, '');
            if (cpf) {
                if (!validarCPF(cpf)) {
                    mostrarErroCPF('CPF inválido! Por favor, verifique o número digitado.');
                    this.focus();
                } else {
                    limparErroCPF();
                }
            } else {
                limparErroCPF();
            }
        });
    }

    // Preview da foto
    if (fotoInput) {
        fotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    fotoUrl = event.target.result;
                    fotoPreview.innerHTML = `<img src="${fotoUrl}" alt="Preview da Foto">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Envio do formulário
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Coleta o CPF e remove formatação
            const cpf = document.getElementById('cpf').value.replace(/[\D]/g, '');
            const cpfInput = document.getElementById('cpf');
            const cpfError = document.getElementById('cpf-error');
            
            // Função para exibir mensagem de erro
            function mostrarErroCPF(mensagem) {
                cpfError.textContent = mensagem;
                cpfError.style.display = 'block';
                cpfInput.classList.add('input-error');
            }
            
            // Valida o CPF antes de enviar
            if (!cpf) {
                mostrarErroCPF('Por favor, preencha o CPF.');
                cpfInput.focus();
                return;
            }
            
            if (!validarCPF(cpf)) {
                mostrarErroCPF('Por favor, insira um CPF válido.');
                cpfInput.focus();
                return;
            }
            
            // Obtém o valor do ORCRIM, incluindo o campo 'outroOrcrim' se necessário
            let orcrimValue = document.getElementById('orcrim').value;
            if (orcrimValue === 'Outros' && outroOrcrimInput.value.trim() !== '') {
                orcrimValue = outroOrcrimInput.value.trim();
            }
            
            // Formata a data para o formato YYYY-MM-DD (padrão ISO 8601)
            let dataNascimento = dataNascimentoInput.value;
            let dataValida = false;
            
            if (dataNascimento) {
                // Converte de dd/mm/aaaa para aaaa-mm-dd
                const [dia, mes, ano] = dataNascimento.split('/');
                if (dia && mes && ano) {
                    // Cria uma data para validação
                    const dataObj = new Date(`${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T12:00:00`);
                    
                    // Verifica se a data é válida
                    if (dataObj.toString() !== 'Invalid Date' && 
                        dataObj.getDate() == parseInt(dia) && 
                        dataObj.getMonth() + 1 == parseInt(mes) && 
                        dataObj.getFullYear() == parseInt(ano)) {
                        
                        dataNascimento = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                        dataValida = true;
                    }
                }
            }
            
            // Valida a data de nascimento
            if (!dataValida) {
                alert('Por favor, insira uma data de nascimento válida no formato dd/mm/aaaa');
                dataNascimentoInput.focus();
                return;
            }
            
            // Coleta os dados do formulário
            const formData = {
                nome: document.getElementById('nome').value,
                alcunha: document.getElementById('alcunha').value,
                data_nascimento: dataNascimento,
                rg: document.getElementById('rg').value,
                cpf: cpf, // CPF sem formatação
                endereco: document.getElementById('endereco').value,
                orcrim: orcrimValue, // Usa o valor do campo 'outroOrcrim' se 'Outros' for selecionado
                antecedentes: document.getElementById('antecedentes').value,
                caracteristicas: document.getElementById('caracteristicas').value,
                foto_url: fotoUrl,
                data_cadastro: new Date().toISOString()
            };

            try {
                console.log('Iniciando processo de cadastro...');
                console.log('Dados do formulário:', formData);
                
                // Verifica se o Supabase está disponível
                if (typeof window.supabase === 'undefined') {
                    throw new Error('Supabase não inicializado');
                }
                
                const supabase = window.supabase;

                // Verifica se já existe um registro com o mesmo CPF
                console.log('Verificando se o CPF já existe...');
                const { data: existing, error: checkError } = await supabase
                    .from('individuos')
                    .select('id')
                    .eq('cpf', formData.cpf);

                console.log('Resultado da verificação de CPF existente:', { existing, checkError });

                if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = nenhum resultado
                    console.error('Erro ao verificar CPF existente:', checkError);
                    throw checkError;
                }

                const hasExistingRecord = existing && existing.length > 0;
                console.log('Registro existente encontrado?', hasExistingRecord);

                if (hasExistingRecord) {
                    // Atualiza o registro existente
                    console.log('Atualizando registro existente...');
                    const { data, error } = await supabase
                        .from('individuos')
                        .update(formData)
                        .eq('cpf', formData.cpf)
                        .select();
                    
                    if (error) {
                        console.error('Erro ao atualizar registro:', error);
                        throw error;
                    }
                    
                    console.log('Registro atualizado com sucesso:', data);
                    successMessage.textContent = 'Cadastro atualizado com sucesso!';
                } else {
                    // Cria um novo registro
                    console.log('Criando novo registro...');
                    const { data, error } = await supabase
                        .from('individuos')
                        .insert([formData])
                        .select();
                    
                    if (error) {
                        console.error('Erro ao criar registro:', error);
                        throw error;
                    }
                    
                    console.log('Novo registro criado com sucesso:', data);
                    successMessage.textContent = 'Cadastro realizado com sucesso!';
                }
                
                // Limpa o formulário
                registrationForm.reset();
                fotoPreview.innerHTML = '';
                
                // Esconde a mensagem após 3 segundos
                setTimeout(() => {
                    successMessage.textContent = '';
                }, 3000);
                
            } catch (error) {
                console.error('Erro ao salvar o cadastro:', error);
                alert('Ocorreu um erro ao salvar o cadastro. Por favor, tente novamente.');
            }
        });
    }
});
