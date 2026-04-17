import { useState, useEffect } from 'react'
import BlogCard from '../components/BlogCard'
import { Loader2 } from 'lucide-react'

export default function Blog() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    document.title = 'Blog — Fertilidad a Tu Lado'
    return () => { document.title = 'Fertilidad a Tu Lado' }
  }, [])

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(({ posts }) => setPosts(posts ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5">
        {/* Cabecera */}
        <div className="text-center mb-14">
          <span className="inline-block text-rose-accent text-sm font-medium tracking-wider uppercase mb-3">
            Blog
          </span>
          <h1 className="section-title mb-4">Artículos y recursos</h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Información clara y honesta sobre fertilidad, tratamientos y todo lo que necesitas saber para tomar decisiones con confianza.
          </p>
        </div>

        {/* Estados */}
        {loading && (
          <div className="flex items-center justify-center h-48 gap-2 text-[#9B9B9B]">
            <Loader2 size={18} className="animate-spin" /> Cargando artículos...
          </div>
        )}

        {error && (
          <div className="text-center text-[#9B9B9B] py-16">
            <p>No se pudieron cargar los artículos. Inténtalo de nuevo más tarde.</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-[#9B9B9B] py-16">
            <p className="text-lg mb-2">Próximamente...</p>
            <p className="text-sm">Estamos preparando contenido para ti. ¡Vuelve pronto!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} variant="full" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
