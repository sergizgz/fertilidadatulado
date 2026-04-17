import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'

function fmtShort(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function PostList({ token, onNew, onEdit }) {
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error, setError]       = useState(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { posts } = await res.json()
      setPosts(posts ?? [])
    } catch {
      setError('Error al cargar los posts')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleDelete = async (post) => {
    if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return
    setDeleting(post.id)
    try {
      await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: post.id }),
      })
      setPosts(prev => prev.filter(p => p.id !== post.id))
    } catch {
      setError('Error al eliminar el post')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-[#2A2A2A]">
          Blog
          <span className="ml-2 text-sm font-sans font-normal text-[#9B9B9B]">({posts.length})</span>
        </h2>
        <button onClick={onNew}
          className="inline-flex items-center gap-2 bg-rose-accent hover:bg-rose-dark text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
          <Plus size={15} /> Nueva entrada
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40 text-[#9B9B9B] text-sm gap-2">
          <Loader2 size={16} className="animate-spin" /> Cargando entradas...
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-cream-darker/20 py-16 text-center">
          <p className="text-[#9B9B9B] text-sm mb-4">Todavía no hay entradas en el blog.</p>
          <button onClick={onNew}
            className="inline-flex items-center gap-2 bg-rose-accent hover:bg-rose-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            <Plus size={15} /> Crear primera entrada
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-darker/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-dark bg-cream/50">
                  <th className="text-left px-4 py-3 font-medium text-[#6B6B6B]">Título</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6B6B6B] whitespace-nowrap">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6B6B6B] whitespace-nowrap">Fecha</th>
                  <th className="px-4 py-3 font-medium text-[#6B6B6B]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-cream-dark/50 hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#2A2A2A]">{post.title}</p>
                      <p className="text-xs text-[#9B9B9B] font-mono mt-0.5">/blog/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        ${post.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {post.published
                          ? <><Eye size={11} /> Publicado</>
                          : <><EyeOff size={11} /> Borrador</>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#9B9B9B] whitespace-nowrap">{fmtShort(post.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <button onClick={() => onEdit(post)}
                          className="p-1.5 rounded-lg text-[#6B6B6B] hover:bg-cream-dark hover:text-rose-accent transition-colors"
                          title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          disabled={deleting === post.id}
                          className="p-1.5 rounded-lg text-[#6B6B6B] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                          title="Eliminar">
                          {deleting === post.id
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
