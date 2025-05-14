# Sistema de Cadastro de Indivíduos

Sistema web responsivo para cadastro e consulta de indivíduos, desenvolvido com HTML, CSS e JavaScript, integrado ao Supabase.

## Funcionalidades

- Autenticação de usuário
- Cadastro de indivíduos com foto
- Consulta por nome, CPF ou RG
- Edição de cadastros existentes
- Interface responsiva para dispositivos móveis

## Configuração

1. **Banco de Dados (Supabase)**
   - Crie uma conta em [https://supabase.com/](https://supabase.com/)
   - Crie um novo projeto
   - Crie uma tabela chamada `individuos` com as seguintes colunas:
     - `id` (uuid, primary key, padrão: `gen_random_uuid()`)
     - `nome` (text)
     - `alcunha` (text, opcional)
     - `data_nascimento` (date)
     - `rg` (text, opcional)
     - `cpf` (text)
     - `orcrim` (text)
     - `antecedentes` (text, opcional)
     - `caracteristicas` (text, opcional)
     - `foto_url` (text, opcional)
     - `data_cadastro` (timestamp with time zone, padrão: `now()`)

2. **Configuração das Políticas de Segurança**
   No SQL Editor do Supabase, execute as seguintes políticas:

   ```sql
   -- Habilita RLS (Row Level Security)
   ALTER TABLE individuos ENABLE ROW LEVEL SECURITY;

   -- Permite leitura pública
   CREATE POLICY "Permitir leitura pública" ON "public"."individuos"
   AS PERMISSIVE FOR SELECT
   TO public
   USING (true);

   -- Permite inserção autenticada
   CREATE POLICY "Permitir inserção autenticada" ON "public"."individuos"
   AS PERMISSIVE FOR INSERT
   TO authenticated
   WITH CHECK (true);

   -- Permite atualização autenticada
   CREATE POLICY "Permitir atualização autenticada" ON "public"."individuos"
   AS PERMISSIVE FOR UPDATE
   TO authenticated
   USING (true)
   WITH CHECK (true);

   -- Permite deleção autenticada
   CREATE POLICY "Permitir deleção autenticada" ON "public"."individuos"
   AS PERMISSIVE FOR DELETE
   TO authenticated
   USING (true);
   ```

3. **Configuração do Projeto**
   - Abra o arquivo `js/supabase-config.js`
   - Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` estão corretas

## Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Faça login com as credenciais:
   - Usuário: admin
   - Senha: admin*
3. Use o botão "Consultar" para buscar cadastros existentes
4. Use o formulário para cadastrar novos indivíduos ou editar existentes

## Estrutura de Arquivos

```
sistema-cadastro/
├── index.html          # Página de login
├── cadastro.html       # Página de cadastro/consulta
├── css/
│   └── style.css       # Estilos CSS
└── js/
    ├── auth.js         # Lógica de autenticação
    ├── supabase-config.js  # Configuração do Supabase
    ├── cadastro.js    # Lógica do formulário de cadastro
    └── consulta.js    # Lógica da busca
```

## Notas de Segurança

- Este é um projeto de demonstração
- Em produção, considere implementar:
  - Autenticação mais robusta
  - Validação de entrada no servidor
  - Proteção contra CSRF
  - Rate limiting
  - Backup regular dos dados

## Licença

Este projeto está sob a licença MIT.
