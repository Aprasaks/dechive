export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ContentType =
  | 'knowledge'
  | 'lecture'
  | 'practice'
  | 'ai_update'
  | 'book';

export type Database = {
  public: {
    Tables: {
      site_members: {
        Row: {
          user_id: string;
          role: 'owner';
          created_at: string;
        };
        Insert: {
          user_id: string;
          role?: 'owner';
          created_at?: string;
        };
        Update: {
          role?: 'owner';
        };
        Relationships: [];
      };
      contents: {
        Row: {
          id: string;
          type: ContentType;
          slug: string;
          status: 'draft' | 'published' | 'archived';
          visibility: 'public' | 'private' | 'unlisted';
          current_revision_id: string | null;
          jarvis_sync_enabled: boolean;
          created_by: string;
          published_at: string | null;
          last_verified_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          type: ContentType;
          slug: string;
          status?: 'draft' | 'published' | 'archived';
          visibility?: 'public' | 'private' | 'unlisted';
          current_revision_id?: string | null;
          jarvis_sync_enabled?: boolean;
          created_by: string;
          published_at?: string | null;
          last_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['contents']['Insert']>;
        Relationships: [];
      };
      content_drafts: {
        Row: {
          content_id: string;
          title: string;
          summary: string;
          body_json: Json;
          metadata: Json;
          version: number;
          updated_by: string;
          updated_at: string;
        };
        Insert: {
          content_id: string;
          title?: string;
          summary?: string;
          body_json?: Json;
          metadata?: Json;
          version?: number;
          updated_by: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          summary?: string;
          body_json?: Json;
          metadata?: Json;
          updated_by?: string;
        };
        Relationships: [];
      };
      content_revisions: {
        Row: {
          id: string;
          content_id: string;
          revision_number: number;
          slug: string;
          title: string;
          summary: string;
          body_json: Json;
          body_checksum: string;
          verification_status:
            | 'unverified'
            | 'reviewed'
            | 'verified'
            | 'needs_review';
          verified_at: string | null;
          created_by: string;
          created_at: string;
          published_at: string;
        };
        Insert: {
          id?: string;
          content_id: string;
          revision_number: number;
          slug: string;
          title: string;
          summary?: string;
          body_json: Json;
          body_checksum: string;
          verification_status?:
            | 'unverified'
            | 'reviewed'
            | 'verified'
            | 'needs_review';
          verified_at?: string | null;
          created_by: string;
          created_at?: string;
          published_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      knowledge_revision_details: {
        Row: {
          revision_id: string;
          learning_objectives: Json;
          toc_enabled: boolean;
        };
        Insert: {
          revision_id: string;
          learning_objectives?: Json;
          toc_enabled?: boolean;
        };
        Update: {
          learning_objectives?: Json;
          toc_enabled?: boolean;
        };
        Relationships: [];
      };
      sources: {
        Row: {
          id: string;
          type:
            | 'official_documentation'
            | 'research_paper'
            | 'book'
            | 'article'
            | 'video'
            | 'dataset'
            | 'other';
          url: string;
          title: string;
          publisher: string | null;
          author: string | null;
          published_at: string | null;
          captured_at: string | null;
          accessed_at: string;
          archived_url: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      revision_sources: {
        Row: {
          revision_id: string;
          source_id: string;
          relationship:
            | 'supports'
            | 'contradicts'
            | 'background'
            | 'example'
            | 'further_reading';
          claim_note: string | null;
          position: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      content_relations: {
        Row: {
          id: string;
          from_revision_id: string;
          to_content_id: string;
          relation_type:
            | 'prerequisite'
            | 'next'
            | 'uses'
            | 'explains'
            | 'practice_for'
            | 'affected_by';
          note: string | null;
          position: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          slug: string;
          label: string;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      revision_tags: {
        Row: {
          revision_id: string;
          tag_id: string;
          position: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          bucket_id: string;
          object_path: string;
          original_filename: string;
          mime_type: string;
          byte_size: number;
          width: number | null;
          height: number | null;
          alt_text: string | null;
          checksum: string;
          uploaded_by: string;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      revision_assets: {
        Row: {
          revision_id: string;
          asset_id: string;
          usage:
            | 'cover'
            | 'body'
            | 'card_news'
            | 'result'
            | 'material'
            | 'download'
            | 'preview';
          caption: string | null;
          position: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_content_draft: {
        Args: {
          p_type: ContentType;
          p_slug: string;
          p_title?: string;
        };
        Returns: string;
      };
      is_dechive_owner: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      save_content_draft: {
        Args: {
          p_content_id: string;
          p_expected_version: number;
          p_slug: string;
          p_title: string;
          p_summary: string;
          p_body_json: Json;
          p_metadata: Json;
        };
        Returns: {
          version: number;
          updated_at: string;
        }[];
      };
    };
    Enums: {
      content_type: ContentType;
      content_status: 'draft' | 'published' | 'archived';
      content_visibility: 'public' | 'private' | 'unlisted';
      member_role: 'owner';
    };
    CompositeTypes: Record<string, never>;
  };
};
