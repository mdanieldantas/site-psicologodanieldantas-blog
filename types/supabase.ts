// Tipos para os dados do Supabase (simplificado)

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string; // uuid
          created_at: string; // timestamp with time zone
          title: string | null;
          content: string | null;
          slug: string | null;
          author_id: string | null; // uuid, assuming a relation to users
          category_id: string | null; // uuid, assuming a relation to categories
          published: boolean | null;
          featured_image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title?: string | null;
          content?: string | null;
          slug?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          published?: boolean | null;
          featured_image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string | null;
          content?: string | null;
          slug?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          published?: boolean | null;
          featured_image_url?: string | null;
        };
      };
      categories: {
        Row: {
          id: string; // uuid
          created_at: string; // timestamp with time zone
          name: string | null;
          slug: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name?: string | null;
          slug?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string | null;
          slug?: string | null;
          description?: string | null;
        };
      };
      // Adicione outras tabelas conforme necessário
    };
    Views: { // Adicione views se houver
      [_ in never]: never;
    };
    Functions: { // Adicione functions se houver
      [_ in never]: never;
    };
    Enums: { // Adicione enums se houver
      [_ in never]: never;
    };
    CompositeTypes: { // Adicione composite types se houver
      [_ in never]: never;
    };
  };
}

// Tipos específicos para facilitar o uso
export type Post = Database['public']['Tables']['posts']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
