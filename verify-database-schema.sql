-- Script para verificar a estrutura real do banco de dados
-- Execute este script no seu Supabase para obter informações precisas

-- 1. Verificar todas as colunas da tabela artigos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'artigos' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se existe o enum schema_type_enum
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'schema_type_enum'
ORDER BY e.enumsortorder;

-- 3. Verificar constraints e tipos especiais
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'artigos'::regclass;

-- 4. Verificar todas as tabelas do schema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 5. Verificar todos os enums existentes
SELECT 
    t.typname as enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
GROUP BY t.typname
ORDER BY t.typname;
