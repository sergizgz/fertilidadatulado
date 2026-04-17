import { useState, useEffect, useRef } from 'react'
import TiptapEditor from '../TiptapEditor'
import { ArrowLeft, Eye, EyeOff, Upload, X, Loader2, Sparkles, CheckCircle2, Copy, Check } from 'lucide-react'
import { marked } from 'marked'

// ─────────────────────────────────────────────────────────────────────────────
// Modal generador IA
// ─────────────────────────────────────────────────────────────────────────────
const TONOS = [
  { value: 'cercano',     label: 'Cercano y empático',       desc: 'Como una amiga experta que explica las cosas con calma' },
  { value: 'profesional', label: 'Profesional y claro',      desc: 'Riguroso, con datos, sin tecnicismos innecesarios' },
  { value: 'divulgativo', label: 'Divulgativo',              desc: 'Educativo y accesible, ideal para quien no sabe nada del tema' },
  { value: 'motivador',   label: 'Motivador y esperanzador', desc: 'Para acompañar emocionalmente en momentos difíciles' },
]

function buildPrompt({ tema, ideas, tono }) {
  const tonoObj = TONOS.find(t => t.value === tono) ?? TONOS[0]
  return `Eres el asistente de escritura de Lidia, enfermera especialista en reproducción asistida con más de 15 años de experiencia. Lidia tiene una web llamada "Fertilidad a Tu Lado" donde publica artículos para informar y acompañar a sus lectoras.

Tema: ${tema}
Ideas a incluir: ${ideas?.trim() || 'Ninguna indicación específica, desarrolla con libertad'}
Tono: ${tonoObj.label} — ${tonoObj.desc}

Instrucciones:
- Dirígete directamente a la lectora (tú)
- Lenguaje accesible; explica los términos técnicos
- Entre 500 y 900 palabras
- Introducción que enganche, secciones con título y cierre con llamada a la acción suave
- Sin frases vacías

Formato de salida (obligatorio):
- Títulos de sección con ##
- Subtítulos con ###
- Negritas con **texto**
- Listas con -
- Citas destacadas con >
- Párrafos separados por línea en blanco
- NO incluyas el título principal en el cuerpo
- Empieza directamente con el contenido, sin preámbulos`
}

function ModalGeneradorIA({ token, onInsert, onClose }) {
  const [tema, setTema]         = useState('')
  const [ideas, setIdeas]       = useState('')
  const [tono, setTono]         = useState('cercano')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [done, setDone]         = useState(false)
  const [copiado, setCopiado]   = useState(false)

  const prompt = buildPrompt({ tema, ideas, tono })
  const canSubmit = tema.trim() && !loading && !done

  // ── Copiar prompt ──
  const handleCopiarPrompt = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  // ── Generar con Groq ──
  const handleGenerar = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tema, ideas, tono }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al generar'); return }
      onInsert(data.markdown)
      setDone(true)
      setTimeout(onClose, 1400)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-darker/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-soft flex items-center justify-center">
              <Sparkles size={16} className="text-rose-accent" />
            </div>
            <div>
              <h3 className="font-medium text-[#2A2A2A] text-sm">Generar con IA</h3>
              <p className="text-xs text-[#9B9B9B]">Genera el artículo aquí mismo o copia el prompt para tu IA favorita</p>
            </div>
          </div>
          {!loading && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-dark text-[#9B9B9B] transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">
              ¿De qué quieres escribir? <span className="text-rose-accent">*</span>
            </label>
            <input
              type="text"
              value={tema}
              onChange={e => setTema(e.target.value)}
              disabled={loading}
              placeholder="Ej: Qué es la reserva ovárica y cómo se evalúa"
              className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Ideas */}
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-1.5">
              Ideas o puntos que quieres incluir
              <span className="text-[#9B9B9B] font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              rows={3}
              value={ideas}
              onChange={e => setIdeas(e.target.value)}
              disabled={loading}
              placeholder="Ej: Mencionar que la AMH no es un diagnóstico definitivo, que la edad es el factor más importante..."
              className="w-full border border-cream-darker rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-accent bg-cream/50 resize-none transition-colors disabled:opacity-50"
            />
          </div>

          {/* Tono */}
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-2">Tono del artículo</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TONOS.map(t => (
                <button key={t.value} type="button"
                  onClick={() => !loading && setTono(t.value)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all ${
                    tono === t.value
                      ? 'border-rose-accent bg-rose-soft/20 text-rose-dark'
                      : 'border-cream-darker bg-white text-[#4A4A4A] hover:border-rose-soft'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-[#9B9B9B] mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
          )}

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {/* Copiar prompt */}
            <button
              type="button"
              onClick={handleCopiarPrompt}
              disabled={!tema.trim() || loading}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-rose-soft text-rose-accent hover:bg-rose-soft/20 text-sm font-medium py-3 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copiado ? <><Check size={14} /> Prompt copiado</> : <><Copy size={14} /> Copiar prompt</>}
            </button>

            {/* Generar con Groq */}
            <button
              type="button"
              onClick={handleGenerar}
              disabled={!canSubmit}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-accent hover:bg-rose-dark text-white text-sm font-medium py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {done
                ? <><CheckCircle2 size={15} /> ¡Insertado!</>
                : loading
                  ? <><Loader2 size={15} className="animate-spin" /> Generando...</>
                  : <><Sparkles size={15} /> Generar artículo</>
              }
            </button>
          </div>

          {loading && <p className="text-xs text-center text-[#9B9B9B]">Generando con IA... unos segundos ☕</p>}

          {!loading && tema.trim() && (
            <p className="text-xs text-[#9B9B9B] text-center">
              "Copiar prompt" → pégalo en ChatGPT o Claude y luego pega la respuesta en el editor.<br />
              "Generar artículo" → lo genera aquí directamente y lo inserta solo.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// PostEditor
// ─────────────────────────────────────────────────────────────────────────────
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
  const [modalIA, setModalIA] = useState(false)

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
    e?.preventDefault()
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

  // ── Insertar contenido generado por IA ──────────────────────
  const handleInsertIA = (markdown) => {
    const html = marked.parse(markdown, { breaks: false })
    setForm(f => ({ ...f, content: html }))
  }

  return (
    <>
      {modalIA && (
        <ModalGeneradorIA
          token={token}
          onInsert={handleInsertIA}
          onClose={() => setModalIA(false)}
        />
      )}

      <div className="space-y-6">
        {/* Cabecera */}
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={onCancel}
            className="p-2 rounded-xl hover:bg-cream-dark text-[#9B9B9B] hover:text-[#2A2A2A] transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h2 className="font-serif text-xl text-[#2A2A2A]">
            {isEditing ? 'Editar entrada' : 'Nueva entrada'}
          </h2>
          <div className="ml-auto flex items-center gap-3 flex-wrap">
            {/* Botón IA */}
            <button type="button" onClick={() => setModalIA(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-accent border border-rose-soft hover:bg-rose-soft/20 px-4 py-2 rounded-full transition-colors">
              <Sparkles size={14} /> Generar con IA
            </button>
            {/* Toggle publicado */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-[#6B6B6B]">
              {form.published
                ? <Eye size={15} className="text-green-500" />
                : <EyeOff size={15} className="text-[#9B9B9B]" />}
              <span className={form.published ? 'text-green-600 font-medium' : ''}>
                {form.published ? 'Publicado' : 'Borrador'}
              </span>
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
    </>
  )
}
