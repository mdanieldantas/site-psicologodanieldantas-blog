export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ArticleSearchResult = {
  id: number;
  titulo: string | null;
  slug: string | null;
  resumo: string | null;
  imagem_capa_arquivo: string | null;
  data_publicacao: string | null;
  categoria_slug: string | null;
};

export type Database = {
  public: {
    Tables: {
      artigos: {
        Row: {
          autor_id: number
          categoria_id: number
          conteudo: string
          data_atualizacao: string
          data_criacao: string
          data_publicacao: string | null
          fts: unknown | null
          id: number
          imagem_capa_arquivo: string | null
          resumo: string | null
          slug: string
          status: string
          subcategoria_id: number | null
          titulo: string
        }
        Insert: {
          autor_id: number
          categoria_id: number
          conteudo: string
          data_atualizacao?: string
          data_criacao?: string
          data_publicacao?: string | null
          fts?: unknown | null
          id?: number
          imagem_capa_arquivo?: string | null
          resumo?: string | null
          slug: string
          status?: string
          subcategoria_id?: number | null
          titulo: string
        }
        Update: {
          autor_id?: number
          categoria_id?: number
          conteudo?: string
          data_atualizacao?: string
          data_criacao?: string
          data_publicacao?: string | null
          fts?: unknown | null
          id?: number
          imagem_capa_arquivo?: string | null
          resumo?: string | null
          slug?: string
          status?: string
          subcategoria_id?: number | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "artigos_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "autores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artigos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artigos_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "subcategorias"
            referencedColumns: ["id"]
          },
        ]
      }
      artigos_tags: {
        Row: {
          artigo_id: number
          tag_id: number
        }
        Insert: {
          artigo_id: number
          tag_id: number
        }
        Update: {
          artigo_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "artigos_tags_artigo_id_fkey"
            columns: ["artigo_id"]
            isOneToOne: false
            referencedRelation: "artigos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artigos_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      autores: {
        Row: {
          biografia: string | null
          data_atualizacao: string
          data_criacao: string
          foto_arquivo: string | null
          id: number
          nome: string
          perfil_academico_url: string | null
        }
        Insert: {
          biografia?: string | null
          data_atualizacao?: string
          data_criacao?: string
          foto_arquivo?: string | null
          id?: number
          nome: string
          perfil_academico_url?: string | null
        }
        Update: {
          biografia?: string | null
          data_atualizacao?: string
          data_criacao?: string
          foto_arquivo?: string | null
          id?: number
          nome?: string
          perfil_academico_url?: string | null        }
        Relationships: []
      }
      categorias: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          descricao: string | null
          id: number
          imagem_url: string | null
          nome: string
          slug: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          id?: number
          imagem_url?: string | null
          nome: string
          slug: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          id?: number
          imagem_url?: string | null
          nome?: string
          slug?: string
        }
        Relationships: []
      }
      newsletter_assinantes: {
        Row: {
          data_confirmacao: string | null
          data_inscricao: string
          email: string
          id: number
          status_confirmacao: string
          token_confirmacao: string | null
          token_expires_at: string | null
          unsubscribe_token: string | null
        }
        Insert: {
          data_confirmacao?: string | null
          data_inscricao?: string
          email: string
          id?: number
          status_confirmacao?: string
          token_confirmacao?: string | null
          token_expires_at?: string | null
          unsubscribe_token?: string | null
        }
        Update: {
          data_confirmacao?: string | null
          data_inscricao?: string
          email?: string
          id?: number
          status_confirmacao?: string
          token_confirmacao?: string | null
          token_expires_at?: string | null
          unsubscribe_token?: string | null
        }
        Relationships: []
      }
      subcategorias: {
        Row: {
          categoria_id: number
          data_atualizacao: string
          data_criacao: string
          descricao: string | null
          id: number
          nome: string
          slug: string
        }
        Insert: {
          categoria_id: number
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          id?: number
          nome: string
          slug: string
        }
        Update: {
          categoria_id?: number
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          id?: number
          nome?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          data_criacao: string
          id: number
          nome: string
          slug: string
        }
        Insert: {
          data_criacao?: string
          id?: number
          nome: string
          slug: string
        }
        Update: {
          data_criacao?: string
          id?: number
          nome?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_articles_fts_or_author: {
        Args: { search_term: string }
        Returns: {
          id: number
          titulo: string
          slug: string
          resumo: string
          imagem_capa_arquivo: string
          data_publicacao: string
          categoria_slug: string
        }[]
      }
      search_articles_paginated: {
        Args: { search_term: string; page_limit: number; page_offset: number }
        Returns: {
          articles: ArticleSearchResult[]
          totalCount: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
