// Função para formatar a data
function formatarDataParaNome(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    
    return `registro_${dia}${mes}${ano}_${horas}${minutos}`;
}

// Função para exportar um item como imagem
function exportarComoImagem(elemento, nomeArquivo) {
    // Cria um clone do elemento para não afetar o DOM original
    const elementoClone = elemento.cloneNode(true);
    
    // Remove os botões do clone
    const botoes = elementoClone.querySelectorAll('.result-footer');
    botoes.forEach(botao => botao.remove());
    
    // Adiciona o clone ao corpo temporariamente (fora da tela)
    elementoClone.style.position = 'fixed';
    elementoClone.style.left = '-9999px';
    elementoClone.style.top = '0';
    elementoClone.style.width = elemento.offsetWidth + 'px';
    elementoClone.style.boxShadow = 'none';
    elementoClone.style.border = '1px solid #e0e0e0';
    document.body.appendChild(elementoClone);
    
    // Configurações para o html2canvas
    const opcoes = {
        scale: 3, // Usamos 1 para melhor compatibilidade com largura
        useCORS: true, // Permite carregar imagens de outras origens
        logging: false, // Desativa os logs
        backgroundColor: '#ffffff', // Fundo branco
        removeContainer: true, // Remove o container temporário após a captura
        width: elemento.offsetWidth,
        windowWidth: elemento.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        onclone: function(clonedDoc, clonedElement) {
            // Aplica estilos específicos para a exportação
            const style = document.createElement('style');
            style.textContent = `
                .result-item { 
                    box-shadow: none !important; 
                    max-width: 100% !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 20px !important;
                }
                .result-footer { 
                    display: none !important; 
                }
                .btn-edit, .btn-exportar { 
                    display: none !important; 
                }
                img {
                    max-width: 100% !important;
                    height: auto !important;
                }
                * {
                    box-sizing: border-box;
                }
            `;
            clonedDoc.head.appendChild(style);
            
            // Ajusta o tamanho do elemento clonado
            clonedElement.style.width = '100%';
            clonedElement.style.maxWidth = '100%';
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '20px';
            
            // Ajusta imagens dentro do elemento
            const images = clonedElement.getElementsByTagName('img');
            for (let img of images) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        }
    };

    // Captura o elemento e gera a imagem
    html2canvas(elementoClone, opcoes).then(canvas => {
        // Cria um link para download
        const link = document.createElement('a');
        link.download = `${nomeArquivo}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9); // Qualidade de 90%
        
        // Dispara o download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Remove o clone do DOM
        document.body.removeChild(elementoClone);
    }).catch(error => {
        console.error('Erro ao exportar a imagem:', error);
        alert('Ocorreu um erro ao exportar a imagem. Por favor, tente novamente.');
        // Garante que o clone seja removido em caso de erro
        if (document.body.contains(elementoClone)) {
            document.body.removeChild(elementoClone);
        }
    });
}

// Adiciona o botão de exportar quando os resultados são exibidos
function adicionarBotaoExportarTodos() {
    const searchResults = document.getElementById('searchResults');
    const resultadoUnico = searchResults?.querySelector('.result-item');
    
    // Se houver apenas um resultado, adiciona o botão de exportar
    if (resultadoUnico && searchResults.children.length === 1) {
        // Remove o botão antigo se existir
        const botaoAntigo = document.getElementById('btnExportarImagem');
        if (botaoAntigo) {
            botaoAntigo.remove();
        }
        
        // Encontra o rodapé do resultado
        const rodape = resultadoUnico.querySelector('.result-footer');
        if (!rodape) return;
        
        // Cria o botão de exportar
        const btnExportar = document.createElement('button');
        btnExportar.id = 'btnExportarImagem';
        btnExportar.className = 'btn-exportar';
        btnExportar.innerHTML = '📥 Baixar Ficha';
        
        // Adiciona o evento de clique
        btnExportar.addEventListener('click', (e) => {
            e.preventDefault();
            const nome = resultadoUnico.querySelector('h3')?.textContent || 'registro';
            const dataAtual = new Date();
            const nomeArquivo = `${nome.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${formatarDataParaNome(dataAtual)}`;
            
            // Exporta o item como imagem
            exportarComoImagem(resultadoUnico, nomeArquivo);
        });
        
        // Adiciona o botão no rodapé, antes do botão de editar
        const btnEditar = rodape.querySelector('.btn-edit');
        rodape.insertBefore(btnExportar, btnEditar);
    } else if (botaoAntigo) {
        // Se não houver apenas um resultado, remove o botão
        botaoAntigo.remove();
    }
}

// Variável para controlar se já estamos processando
let isProcessing = false;

// Observa mudanças nos resultados da busca
const observer = new MutationObserver((mutations) => {
    // Ignora se já estiver processando
    if (isProcessing) return;
    
    // Verifica se houve adição ou remoção de nós
    const hasRelevantMutation = mutations.some(mutation => 
        mutation.type === 'childList' && 
        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    );
    
    if (hasRelevantMutation) {
        isProcessing = true;
        try {
            adicionarBotaoExportarTodos();
        } finally {
            // Usa setTimeout para garantir que todas as mutações sejam processadas
            // antes de permitir novas execuções
            setTimeout(() => {
                isProcessing = false;
            }, 100);
        }
    }
});

// Inicia a observação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        // Configura o observer para observar apenas adições/remoções de nós filhos
        observer.observe(searchResults, { 
            childList: true, 
            subtree: false, // Importante: não observar subárvores para evitar loops
            attributes: false,
            characterData: false
        });
    }
});
