import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import { ArrowRight } from 'lucide-react'

export default function BlogPreview() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts?limit=3')
      .then(r => r.json())
      .then(({ posts }) => setPosts(posts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // No mostrar la sección si no hay posts publicados
  if (!loading && posts.length === 0) return null

  return (
    <section id="blog" className="py-24 bg-cream-dark/40">
      <div className="max-w-6xl mx-auto px-5">
        {/* Cabecera */}
        <div className="text-center mb-14">
          <span className="inline-block text-rose-accent text-sm font-medium tracking-wider uppercase mb-3">
            Blog
          </span>
          <h2 className="section-title mb-4">Artículos y recursos</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Información clara y honesta sobre fertilidad, tratamientos y todo lo que necesitas saber para tomar decisiones con confianza.
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-cream-darker/30 h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} variant="preview" />
            ))}
          </div>
        )}

        {/* Enlace al blog completo */}
        {!loading && posts.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-rose-accent hover:text-rose-dark transition-colors border border-rose-soft rounded-full px-6 py-3 hover:bg-rose-soft/20">
              Ver todos los artículos <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
