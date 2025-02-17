import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_KEY ?? '')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query
  const { tag } = JSON.parse(req.body)

  if (username) {
    const { data } = await supabase
      .from('casts')
      .select('*')
      .filter('username', 'eq', username)
      .filter('deleted', 'eq', false)
      .textSearch('fts', tag as string)
      .order('published_at', { ascending: false })
      .limit(1000)

    return res.status(200).json(data)
  } else {
    return res.end()
  }
}
