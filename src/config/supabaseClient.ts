// src/config/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'supabase-url
const supabaseKey = 'supa-key'

export const supabase = createClient(supabaseUrl, supabaseKey)