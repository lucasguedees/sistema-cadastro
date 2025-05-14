document.addEventListener('DOMContentLoaded', async function() {
    // Verifica e cria a coluna endereco se não existir
    try {
        // Tenta adicionar a coluna se não existir
        const { error } = await supabase.rpc('add_endereco_column_if_not_exists');
        
        if (error && !error.message.includes('already exists')) {
            console.error('Erro ao verificar/criar coluna endereco:', error);
        } else if (!error) {
            console.log('Coluna endereco verificada/criada com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao verificar/criar coluna endereco:', error);
    }
    const consultarBtn = document.getElementById('consultarBtn');
    const searchForm = document.getElementById('searchForm');
    const searchBtn = document.getElementById('searchBtn');
    const voltarBtn = document.getElementById('voltarBtn');
    const searchTerm = document.getElementById('searchTerm');
    const searchResults = document.getElementById('searchResults');
    const registrationForm = document.getElementById('registrationForm');
    
    // Alternar visibilidade do formulário de busca
    if (consultarBtn) {
        consultarBtn.addEventListener('click', function() {
            const isVisible = searchForm.style.display === 'block';
            searchForm.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                searchTerm.focus();
                
                // Se o formulário de cadastro estiver visível, esconde-o
                if (registrationForm && registrationForm.style.display !== 'none') {
                    registrationForm.style.display = 'none';
                }
            } else {
                // Se estiver fechando o formulário de busca, mostra o de cadastro
                if (registrationForm) {
                    registrationForm.style.display = 'block';
                }
            }
        });
    }
    
    // Função para carregar um registro no formulário
    function loadRecord(record) {
        if (!registrationForm) return;
        
        // Mostra o formulário de cadastro se estiver escondido
        if (registrationForm.style.display === 'none') {
            registrationForm.style.display = 'block';
            searchForm.style.display = 'none';
        }
        
        // Preenche os campos do formulário
        document.getElementById('nome').value = record.nome || '';
        document.getElementById('alcunha').value = record.alcunha || '';
        document.getElementById('dataNascimento').value = record.data_nascimento || '';
        document.getElementById('rg').value = record.rg || '';
        document.getElementById('cpf').value = record.cpf || '';
        document.getElementById('endereco').value = record.endereco || '';
        document.getElementById('orcrim').value = record.orcrim || '';
        document.getElementById('antecedentes').value = record.antecedentes || '';
        document.getElementById('caracteristicas').value = record.caracteristicas || '';
        
        // Atualiza a visualização da foto se existir
        const fotoPreview = document.getElementById('fotoPreview');
        if (fotoPreview && record.foto_url) {
            fotoPreview.innerHTML = `<img src="${record.foto_url}" alt="Foto do registro">`;
        }
    }
    
    // Função para formatar a data
    function formatarData(dataString) {
        if (!dataString) return 'Não informada';
        try {
            // Tenta converter para data e formata
            const data = new Date(dataString);
            if (isNaN(data.getTime())) {
                throw new Error('Data inválida');
            }
            return data.toLocaleDateString('pt-BR');
        } catch (e) {
            console.warn('Erro ao formatar data:', dataString, e);
            return 'Data não disponível';
        }
    }
    
    // Função para formatar data e hora
    function formatarDataHora(dataString) {
        if (!dataString) return 'Não informada';
        try {
            const data = new Date(dataString);
            if (isNaN(data.getTime())) {
                throw new Error('Data/hora inválida');
            }
            return data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (e) {
            console.warn('Erro ao formatar data/hora:', dataString, e);
            return 'Data/hora não disponível';
        }
    }

    // Função para escapar HTML para evitar injeção
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Função para exibir os resultados da busca
    function displayResults(results) {
        // Limpa os resultados atuais de forma eficiente
        while (searchResults.firstChild) {
            searchResults.removeChild(searchResults.firstChild);
        }
        
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Nenhum registro encontrado.</div>';
            return;
        }
        
        // Usa DocumentFragment para melhor desempenho
        const fragment = document.createDocumentFragment();
        
        results.forEach(record => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // Prepara os dados escapando o HTML
            const nome = escapeHtml(record.nome || 'Sem nome');
            const fotoUrl = record.foto_url ? escapeHtml(record.foto_url) : '';
            const alcunha = escapeHtml(record.alcunha || '');
            const dataNasc = formatarData(record.data_nascimento);
            const cpf = escapeHtml(record.cpf || '');
            const rg = escapeHtml(record.rg || '');
            const orcrim = escapeHtml(record.orcrim || '');
            const antecedentes = record.antecedentes ? escapeHtml(record.antecedentes) : '';
            const caracteristicas = record.caracteristicas ? escapeHtml(record.caracteristicas) : '';
            const dataAtualizacao = formatarDataHora(record.updated_at || record.created_at);
            
            // Usa template strings com variáveis já processadas
            resultItem.innerHTML = `
                <div class="result-header">
                    <h3>${nome}</h3>
                </div>
                <div class="result-content">
                    <div class="result-photo">
                        ${fotoUrl ? 
                            `<img src="${fotoUrl}" alt="Foto de ${nome}" loading="lazy">` : 
                            '<div class="no-photo">Sem foto</div>'}
                    </div>
                    <div class="result-details">
                        <p><strong>Alcunha:</strong> ${alcunha || 'Não informada'}</p>
                        <p><strong>Data de Nascimento:</strong> ${dataNasc}</p>
                        <p><strong>CPF:</strong> ${cpf || 'Não informado'}</p>
                        <p><strong>RG:</strong> ${rg || 'Não informado'}</p>
                        <p><strong>Endereço:</strong> ${record.endereco ? escapeHtml(record.endereco) : 'Não informado'}</p>
                        <p><strong>ORCRIM:</strong> ${orcrim || 'Não informado'}</p>
                        ${antecedentes ? 
                            `<p class="multi-line"><strong>Antecedentes:</strong> ${antecedentes}</p>` : ''}
                        ${caracteristicas ? 
                            `<p class="multi-line"><strong>Características:</strong> ${caracteristicas}</p>` : ''}
                        <p class="updated-at"><small><em>Última atualização: ${dataAtualizacao}</em></small></p>
                    </div>
                </div>
                <div class="result-footer">
                    <button class="btn-edit" data-id="${record.id}">Editar Cadastro</button>
                </div>
            `;
            
            // Adiciona o evento de clique para carregar o registro
            const editBtn = resultItem.querySelector('.btn-edit');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadRecord(record);
                });
            }
            
            fragment.appendChild(resultItem);
        });
        
        // Adiciona todos os itens de uma vez
        searchResults.appendChild(fragment);
    }
    
    // Evento de busca
    if (searchBtn) {
        searchBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const term = searchTerm.value.trim();
            if (!term) {
                searchResults.innerHTML = '<div class="no-results">Digite um termo para buscar.</div>';
                return;
            }
            
            try {
                // Busca no Supabase
                const { data, error } = await supabase
                    .from('individuos')
                    .select('*, endereco')
                    .or(`nome.ilike.%${term}%,cpf.eq.${term},rg.eq.${term}`)
                    .order('nome', { ascending: true });
                
                if (error) throw error;
                
                console.log('Dados retornados da consulta:', data);
                displayResults(data || []);
                
            } catch (error) {
                console.error('Erro na busca:', error);
                searchResults.innerHTML = '<div class="no-results">Ocorreu um erro na busca. Tente novamente.</div>';
            }
        });
    }
    
    // Permitir busca ao pressionar Enter
    if (searchTerm) {
        searchTerm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (searchBtn) searchBtn.click();
            }
        });
    }
    
    // Funcionalidade do botão Voltar
    if (voltarBtn) {
        voltarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Esconde o formulário de busca
            if (searchForm) searchForm.style.display = 'none';
            // Mostra o formulário de cadastro
            if (registrationForm) registrationForm.style.display = 'block';
            // Limpa os resultados da busca
            if (searchResults) searchResults.innerHTML = '';
            // Limpa o campo de busca
            if (searchTerm) searchTerm.value = '';
        });
    }
});
