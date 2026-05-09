export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamp = string;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          created_at: Timestamp;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          created_at?: Timestamp;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string;
          created_at?: Timestamp;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      organizations: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string;
          contact_email: string;
          website_url: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description: string;
          contact_email: string;
          website_url?: string | null;
          created_at?: Timestamp;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string;
          contact_email?: string;
          website_url?: string | null;
          created_at?: Timestamp;
        };
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          event_type: string;
          description: string;
          start_time: Timestamp;
          end_time: Timestamp;
          location: string;
          max_attendees: number | null;
          volunteer_slots_needed: number | null;
          contact_email: string;
          language_notes: string | null;
          accessibility_notes: string | null;
          published: boolean;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          event_type: string;
          description: string;
          start_time: Timestamp;
          end_time: Timestamp;
          location: string;
          max_attendees?: number | null;
          volunteer_slots_needed?: number | null;
          contact_email: string;
          language_notes?: string | null;
          accessibility_notes?: string | null;
          published?: boolean;
          created_at?: Timestamp;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          event_type?: string;
          description?: string;
          start_time?: Timestamp;
          end_time?: Timestamp;
          location?: string;
          max_attendees?: number | null;
          volunteer_slots_needed?: number | null;
          contact_email?: string;
          language_notes?: string | null;
          accessibility_notes?: string | null;
          published?: boolean;
          created_at?: Timestamp;
        };
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      rsvps: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string;
          phone: string | null;
          guests: number;
          notes: string | null;
          checked_in: boolean;
          checked_in_at: Timestamp | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          phone?: string | null;
          guests?: number;
          notes?: string | null;
          checked_in?: boolean;
          checked_in_at?: Timestamp | null;
          created_at?: Timestamp;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          guests?: number;
          notes?: string | null;
          checked_in?: boolean;
          checked_in_at?: Timestamp | null;
          created_at?: Timestamp;
        };
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      volunteers: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          preferred_role: string | null;
          notes: string | null;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          preferred_role?: string | null;
          notes?: string | null;
          created_at?: Timestamp;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          preferred_role?: string | null;
          notes?: string | null;
          created_at?: Timestamp;
        };
        Relationships: [
          {
            foreignKeyName: "volunteers_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
        ];
      };
      generated_messages: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          message_type: string;
          output: string;
          created_at: Timestamp;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          message_type: string;
          output: string;
          created_at?: Timestamp;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          message_type?: string;
          output?: string;
          created_at?: Timestamp;
        };
        Relationships: [
          {
            foreignKeyName: "generated_messages_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generated_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
