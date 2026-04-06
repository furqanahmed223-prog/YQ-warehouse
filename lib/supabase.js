import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jchhgqdteoxntrtytspd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjaGhncWR0ZW94bnRydHl0c3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjAwMzgsImV4cCI6MjA5MTAzNjAzOH0.yirlBBIZ6Gm7LrNsE763ut-kolb-YefD8CAPa2rHciw'

export const supabase = createClient(supabaseUrl, supabaseKey)
