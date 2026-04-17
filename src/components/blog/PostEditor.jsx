import { useState, useEffect, useRef } from 'react'
import TiptapEditor from '../TiptapEditor'
import { ArrowLeft, Eye, EyeOff, Upload, X, Loader2 } from 'lucide-react'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function PostEditor({ post, token, onSave, onCancel }) {
  const isEditing = !!post
  const coverInputRef = useRef(null)

  const [form, setForm] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    cover_image_url: post?.cover_image_url ?? '',
    published: post?.published ?? false,
  })
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [error, setError] = useState(null)

  // Auto-generar slug desde título si no fue tocado manualmente
  useEffect(() => {
    if (!slugTouched && form.title) {
      setForm(f => ({ ...f, slug: slugify(f.title) }))
    }
  }, [form.title, slugTouched])

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
  }

  // ── Subida portada ──────────────────────────────────────────
  const handleCoverUpload = async (file) => {
    if (!file) return
    setUploadingCover(true)
    setError(null)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, contentType: file.type, data: base64 }),
      })
      const { url, error: uploadErr } = await res.json()
      if (url) setForm(f => ({ ...f, cover_image_url: url }))
      else setError(uploadErr ?? 'Error al subir la imagen')
    } catch {
      setError('Error al subir la imagen')
    } finally {
      setUploadingCover(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  // ── Guardar ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('El título es obligatorio'); return }
    if (!form.slug.trim())  { setError('El slug es obligatorio'); return }

    setSaving(true)
    setError(null)
    try {
      const method = isEditing ? 'PATCH' : 'POST'
      const body = isEditing ? { id: post.id, ...form } : form
      const res = await fetch('/api/posts', {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al guardar'); return }
      onSave(data.post)
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel}
          className="p-2 rounded-xl hover:bg-cream-dark text-[#9B9B9B] hover:text-[#2A2A2A] transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-serif text-xl text-[#2A2A2A]">
          {isEditing ? 'Editar entrada' : 'Nueva entrada'}
        </h2>
        <div className="ml-auto flex items-center gap-3">
          {/* Toggle publicado */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-[#6B6B6B]">
            {form.published
              ? <Eye size={15} className="text-green-500" />
              : <EyeOff size={15} className="text-[#9B9B9B]" />}
            <span className={form.published ? 'text-green-600 font-medium' : ''}>
              {form.published ? 'Publicado' : 'Borrador'}
            </span>
            <input type="checkbox" className="sr-only" checked={form.published} onChange={set('published')} />
            <div
              onClick={() => setForm(f => ({ ...f, published: !f.published }))}
              className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative
                ${form.published ? 'bg-green-400' : 'bg-cream-darker'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
          <button type="button" onClick={handleSubmit} disabled={saving}
            className="inline-flex items-center gap-2 bg-rose-accent hover:bg-rose-dark text-white text-sm font-medium px-5 py-2 rounded-full transition-colors disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Crear entrada')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Título</label>
          <input
            type="text"
            value={form.title}
            onChange={set('title')}
            placeholder="Ej: Todo lo que debes saber sobre la estimulación ovárica"
            className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-white transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">
            Slug <span className="text-[#9B9B9B] font-normal">(URL: /blog/<em>{form.slug || 'slug-del-articulo'}</em>)</span>
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={e => { setSlugTouched(true); set('slug')(e) }}
            placeholder="slug-del-articulo"
            className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-white transition-colors font-mono"
          />
        </div>

        {/* Extracto */}
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">
            Extracto <span className="text-[#9B9B9B] font-normal">(resumen corto para las cards)</span>
          </label>
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={set('excerpt')}
            placeholder="Breve descripción del artículo (1-2 frases)..."
            maxLength={300}
            className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-white resize-none transition-colors"
          />
          <p className="text-xs text-[#9B9B9B] mt-1 text-right">{form.excerpt.length}/300</p>
        </div>

        {/* Imagen de portada */}
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Imagen de portada</label>
          {form.cover_image_url ? (
            <div className="relative w-full max-w-md">
              <img src={form.cover_image_url} alt="Portada" className="w-full h-48 object-cover rounded-xl border border-cream-darker" />
              <button type="button"
                onClick={() => setForm(f => ({ ...f, cover_image_url: '' }))}
                className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors">
                <X size={14} className="text-[#6B6B6B]" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => coverInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed border-cream-darker rounded-xl cursor-pointer hover:border-rose-accent hover:bg-rose-soft/10 transition-colors">
              {uploadingCover
                ? <Loader2 size={20} className="text-rose-accent animate-spin" />
                : <>
                    <Upload size={20} className="text-[#9B9B9B] mb-2" />
                    <p className="text-sm text-[#9B9B9B]">Haz clic para subir una imagen</p>
                    <p className="text-xs text-[#C0C0C0] mt-1">JPG, PNG, WebP · máx. 3 MB</p>
                  </>
              }
            </div>
          )}
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => handleCoverUpload(e.target.files?.[0])} />
          {/* O URL manual */}
          {!form.cover_image_url && (
            <div className="mt-2">
              <input type="text" value={form.cover_image_url}
                onChange={set('cover_image_url')}
                placeholder="O pega una URL de imagen..."
                className="w-full max-w-md border border-cream-darker rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-accent bg-white transition-colors" />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">Contenido</label>
          <TiptapEditor
            value={form.content}
            onChange={val => setForm(f => ({ ...f, content: val }))}
            token={token}
          />
        </div>
      </form>
    </div>
  )
}
