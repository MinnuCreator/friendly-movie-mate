export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          user_id: string
          movie_id: number
          movie_title: string
          show_date: string
          show_time: string
          seats_count: number
          total_amount: number
          snacks: Json
          cab_booking: Json | null
          booking_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: number
          movie_title: string
          show_date: string
          show_time: string
          seats_count: number
          total_amount: number
          snacks?: Json
          cab_booking?: Json | null
          booking_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: number
          movie_title?: string
          show_date?: string
          show_time?: string
          seats_count?: number
          total_amount?: number
          snacks?: Json
          cab_booking?: Json | null
          booking_status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster_path: string | null
          movie_release_date: string | null
          movie_vote_average: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_vote_average?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: number
          movie_title?: string
          movie_poster_path?: string | null
          movie_release_date?: string | null
          movie_vote_average?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
