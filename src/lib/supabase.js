
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://drsyolwedihcbaiilnde.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyc3lvbHdlZGloY2JhaWlsbmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MzY5MzEsImV4cCI6MjA2MTAxMjkzMX0.PCR-hVBr-YxYmbxjFZ_rJ6CzogOj2YIALgAxO99YchY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
