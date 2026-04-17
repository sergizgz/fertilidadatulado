import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No autorizado' })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Sesión inválida' })

  const { filename, contentType, data: base64data } = req.body
  if (!filename || !contentType || !base64data) {
    return res.status(400).json({ error: 'Datos de imagen incompletos' })
  }

  // Validar tipo de archivo
  if (!contentType.startsWith('image/')) {
    return res.status(400).json({ error: 'Solo se permiten imágenes' })
  }

  const buffer = Buffer.from(base64data, 'base64')
  const ext = filename.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(path, buffer, { contentType, upsert: false })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return res.status(500).json({ error: 'Error al subir la imagen' })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(path)

  return res.status(200).json({ url: publicUrl })
}
