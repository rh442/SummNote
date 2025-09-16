import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lcshvcherrfsefpgjheg.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjc2h2Y2hlcnJmc2VmcGdqaGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NjY5NzEsImV4cCI6MjA3MTE0Mjk3MX0.5zSsZVEH1o9E-PH3DSEDp_-Wb3vGo9r1DBnttwKgtV4"

export const supabase = createClient(supabaseUrl, supabaseKey)