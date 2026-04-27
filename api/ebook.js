import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const FILENAME = 'Ebook porque no te quedas embarazada.pdf'

export default async function handler(req, res) {
  // Obtener la URL real del PDF desde site_settings
  const { data: setting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'ebook_pdf_url')
    .single()

  const pdfUrl = setting?.value || `${process.env.VITE_SUPABASE_URL ? '' : ''}/ebook.pdf`

  // Si es una URL relativa, construirla con el host de la request
  const absoluteUrl = pdfUrl.startsWith('http')
    ? pdfUrl
    : `https://${req.headers.host}${pdfUrl}`

  try {
    const upstream = await fetch(absoluteUrl)
    if (!upstream.ok) throw new Error(`Upstream ${upstream.status}`)

    const buffer = await upstream.arrayBuffer()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(FILENAME)}`)
    res.setHeader('Content-Length', buffer.byteLength)
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).send(Buffer.from(buffer))
  } catch (err) {
    console.error('Error sirviendo ebook:', err)
    return res.status(502).json({ error: 'No se pudo obtener el ebook' })
  }
}
