# SPECS - [Nome da Ferramenta]

## STACK TECNOLÓGICA
[Listar a stack obrigatória conforme definido anteriormente, com ênfase em Mobile First no Frontend]

---

## MODELAGEM DE DADOS (SUPABASE & DRIZZLE)

### Diretriz de Privacidade
**ATENÇÃO:** Nenhuma tabela deve conter campos para Nome, CPF, ou Prontuário de pacientes reais. O banco armazena apenas configurações do usuário, logs de uso anônimos ou casos de estudo salvos.

### Tabela: user_preferences
Armazena configurações do médico/estudante.
```sql
-- Exemplo
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL, -- Clerk ID
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);