import { jsonStore } from './jsonStore';
import { supabaseStore } from './supabaseStore';

export const repo = process.env.DATA_BACKEND === 'supabase' ? supabaseStore : jsonStore;
// export const repo = process.env.DATA_BACKEND === 'supabase' ? jsonStore :supabaseStore  ;
