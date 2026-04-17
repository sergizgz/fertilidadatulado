import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react'

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetch(`/api/posts?slug=${encodeURIComponent(slug)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then(data => { if (data?.post) setPost(data.post) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (post) document.title = `${post.title} — Fertilidad a Tu Lado`
    return () => { document.title = 'Fertilidad a Tu Lado' }
  }, [post])

  if (loading) return (
    <div className="min-h-screen bg-cream pt-24 flex items-center justify-center gap-2 text-[#9B9B9B]">
      <Loader2 size={18} className="animate-spin" /> Cargando artículo...
    </div>
  )

  if (notFound || !post) return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-5 text-center py-20">
        <p className="font-serif text-2xl text-[#2A2A2A] mb-3">Artículo no encontrado</p>
        <p className="text-[#9B9B9B] mb-8">El artículo que buscas no existe o ha sido eliminado.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-rose-accent hover:text-rose-dark transition-colors">
          <ArrowLeft size={14} /> Volver al blog
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5">
        {/* Volver */}
        <Link to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#9B9B9B] hover:text-rose-accent transition-colors mb-8">
          <ArrowLeft size={14} /> Volver al blog
        </Link>

        {/* Imagen de portada */}
        {post.cover_image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 max-h-[420px]">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Cabecera del artículo */}
        <header className="mb-10">
          <div className="flex items-center gap-1.5 text-sm text-[#9B9B9B] mb-4">
            <Calendar size={14} />
            <span>{fmtDate(post.created_at)}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#2A2A2A] leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-[#6B6B6B] leading-relaxed border-l-2 border-rose-soft pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Separador */}
        <hr className="border-cream-darker mb-10" />

        {/* Contenido */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-[#2A2A2A]
            prose-p:text-[#4A4A4A] prose-p:leading-relaxed
            prose-a:text-rose-accent prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-rose-accent prose-blockquote:text-[#6B6B6B]
            prose-strong:text-[#2A2A2A]
            prose-img:rounded-xl
            prose-code:text-rose-dark prose-code:bg-cream-dark prose-code:px-1 prose-code:rounded
            prose-pre:bg-[#2A2A2A] prose-pre:text-cream"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Firma */}
        <div className="mt-16 pt-8 border-t border-cream-darker">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-soft flex items-center justify-center shrink-0">
              <span className="text-xl">🌸</span>
            </div>
            <div>
              <p className="font-medium text-[#2A2A2A]">Lidia</p>
              <p className="text-sm text-[#9B9B9B]">Enfermera especialista en reproducción asistida · +15 años de experiencia</p>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/#contacto"
              className="inline-flex items-center gap-2 bg-rose-accent hover:bg-rose-dark text-white text-sm font-medium px-6 py-3 rounded-full transition-colors">
              ¿Tienes dudas? Contáctame
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
