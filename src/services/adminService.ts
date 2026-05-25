import { supabase } from '../lib/supabase'

export async function verificarAdmin() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error) {

    console.error(error)

    return false
  }

  return data.is_admin
}