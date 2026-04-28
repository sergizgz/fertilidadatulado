import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function authenticate(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  return user
}

export default async function handler(req, res) {
  if (req.method === 'GET')    return handleGet(req, res)
  if (req.method === 'POST')   return handlePost(req, res)
  if (req.method === 'PATCH')  return handlePatch(req, res)
  if (req.method === 'DELETE') return handleDelete(req, res)
  return res.status(405).json({ error: 'Método no permitido' })
}

// ── GET /api/posts?slug=xxx  → post individual
// ── GET /api/posts?limit=3   → últimos N posts
// ── GET /api/posts            → todos
// Si hay token válido → incluye borradores. Si no → solo publicados.
async function handleGet(req, res) {
  const { slug, limit } = req.query
  const user = await authenticate(req)

  if (slug) {
    let query = supabase.from('blog_posts').select('*').eq('slug', slug)
    if (!user) query = query.eq('published', true)
    const { data, error } = await query.maybeSingle()
    if (error || !data) return res.status(404).json({ error: 'Post no encontrado' })
    return res.status(200).json({ post: data })
  }

  let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (!user) query = query.eq('published', true)
  if (limit) query = query.limit(parseInt(limit))

  const { data, error } = await query
  if (error) {
    console.error('posts GET error:', JSON.stringify(error))
    return res.status(500).json({ error: 'Error al obtener los posts', detail: error.message })
  }
  return res.status(200).json({ posts: data ?? [] })
}

// ── POST /api/posts  → crear post (protegido)
async function handlePost(req, res) {
  const user = await authenticate(req)
  if (!user) return res.status(401).json({ error: 'No autorizado' })

  const { title, slug, excerpt, content, cover_image_url, published } = req.body
  if (!title || !slug) return res.status(400).json({ error: 'Título y slug son obligatorios' })

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({ title, slug, excerpt, content, cover_image_url, published: published ?? false })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Este slug ya está en uso' })
    return res.status(500).json({ error: 'Error al crear el post' })
  }
  return res.status(201).json({ post: data })
}

// ── PATCH /api/posts  → actualizar post (protegido)
async function handlePatch(req, res) {
  const user = await authenticate(req)
  if (!user) return res.status(401).json({ error: 'No autorizado' })

  const { id, ...fields } = req.body
  if (!id) return res.status(400).json({ error: 'Se requiere id' })

  // Solo permitir campos válidos
  const allowed = ['title', 'slug', 'excerpt', 'content', 'cover_image_url', 'published']
  const updates = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)))

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Este slug ya está en uso' })
    return res.status(500).json({ error: 'Error al actualizar el post' })
  }
  return res.status(200).json({ post: data })
}

// ── DELETE /api/posts  → eliminar post (protegido)
async function handleDelete(req, res) {
  const user = await authenticate(req)
  if (!user) return res.status(401).json({ error: 'No autorizado' })

  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Se requiere id' })

  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return res.status(500).json({ error: 'Error al eliminar el post' })
  return res.status(200).json({ ok: true })
}
