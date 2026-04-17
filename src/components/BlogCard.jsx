import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

// variant: 'preview' (home, compacta) | 'full' (listado /blog)
export default function BlogCard({ post, variant = 'full' }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl border border-cream-darker/30 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Imagen de portada */}
      {post.cover_image_url ? (
        <div className="overflow-hidden h-48 shrink-0">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-48 shrink-0 bg-gradient-to-br from-cream-dark to-rose-soft/40 flex items-center justify-center">
          <span className="text-4xl">🌸</span>
        </div>
      )}

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-[#9B9B9B] mb-3">
          <Calendar size={12} />
          <span>{fmtDate(post.created_at)}</span>
        </div>

        <h3 className="font-serif text-base font-medium text-[#2A2A2A] leading-snug mb-2 group-hover:text-rose-accent transition-colors line-clamp-2">
          {post.title}
        </h3>

        {variant === 'full' && post.excerpt && (
          <p className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className={`flex items-center gap-1 text-xs font-medium text-rose-accent group-hover:gap-2 transition-all ${variant === 'full' ? 'mt-auto' : 'mt-3'}`}>
          Leer más <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  )
}
