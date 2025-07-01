import { createClient } from '@supabase/supabase-js';
export const supabaseUrl = 'https://wocqyxlcknfwyyabbico.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvY3F5eGxja25md3l5YWJiaWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODY0MjMsImV4cCI6MjA2NjI2MjQyM30._8mZ7olFnEYXNbbLFJs2R4pDU5bpRmV1xwgCzgggAFI';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
