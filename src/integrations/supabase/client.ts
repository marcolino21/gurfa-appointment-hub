
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdezwftreygyoafirizz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZXp3ZnRyZXlneW9hZmlyaXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3ODY2OTksImV4cCI6MjA2MDM2MjY5OX0.SRSPgkWPfagvv_iYpt0a8Bd-8PfsAxdPU1N38rfAufM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
