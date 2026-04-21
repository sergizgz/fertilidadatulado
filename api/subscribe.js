import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { email } = req.body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' })
  }

  try {
    // Upsert — si el email ya existe, no falla ni lanza error
    const { error: dbError } = await supabase
      .from('subscribers')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

    if (dbError) {
      console.error('Error guardando suscriptor:', dbError)
      return res.status(500).json({ error: 'Error al guardar' })
    }

    // URL del PDF desde site_settings (actualizable desde el panel privado)
    const { data: setting } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'ebook_pdf_url')
      .single()

    const pdfUrl = setting?.value || '/ebook.pdf'

    return res.status(200).json({ ok: true, pdfUrl })
  } catch (err) {
    console.error('Error en /api/subscribe:', err)
    return res.status(500).json({ error: 'Error interno' })
  }
}
