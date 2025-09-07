import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgbrdmccaxgsknluxcre.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYnJkbWNjYXhnc2tubHV4Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzg0OTAsImV4cCI6MjA3Mjg1NDQ5MH0.k7gU0a67nWOApF7DdDSH_x2Ihsy64M8ZRbby7qnrc2U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
