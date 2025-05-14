// Configuração do Supabase
const SUPABASE_URL = 'https://vnfnsftwvjhtfozlybnt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZm5zZnR3dmpodGZvemx5Ym50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjk0MTMsImV4cCI6MjA2Mjc0NTQxM30.N5pTOROPazmaJd2tf4EiJsuZ3jS-y7cBuQiS77NDUdc';

// Inicializa o Supabase
try {
    // Cria a instância do Supabase e a torna global
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase inicializado com sucesso');
    
    // Testa a conexão
    window.supabase.from('individuos').select('*').limit(1)
        .then(({ error }) => {
            if (error) {
                console.error('Erro ao testar conexão com o Supabase:', error);
            } else {
                console.log('Conexão com o banco de dados testada com sucesso');
            }
        });
        
} catch (error) {
    console.error('Erro ao inicializar o Supabase:', error);
    alert('Erro ao inicializar o sistema. Por favor, recarregue a página.');
}
