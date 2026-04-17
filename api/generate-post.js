const TONOS = {
  cercano:     'Cercano y empático, como una amiga experta que explica las cosas con calma y sin tecnicismos',
  profesional: 'Profesional y claro, riguroso, con datos, sin tecnicismos innecesarios',
  divulgativo: 'Divulgativo y accesible, educativo, ideal para quien no sabe nada del tema',
  motivador:   'Motivador y esperanzador, para acompañar emocionalmente en momentos difíciles',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  // Validar sesión
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No autorizado' })

  const { tema, ideas, tono } = req.body
  if (!tema?.trim()) return res.status(400).json({ error: 'El tema es obligatorio' })

  const tonoDesc = TONOS[tono] ?? TONOS.cercano

  const systemPrompt = `Eres el asistente de escritura de Lidia, enfermera especialista en reproducción asistida con más de 15 años de experiencia acompañando a parejas y mujeres en su camino hacia la maternidad. Lidia tiene una web llamada "Fertilidad a Tu Lado" donde publica artículos de blog para informar, acompañar y orientar a sus lectoras.

Escribe en un tono ${tonoDesc}.
Usa un lenguaje accesible; cuando uses términos técnicos, explícalos.
El artículo debe tener entre 500 y 900 palabras.
Incluye una introducción que enganche, secciones con título y un cierre con llamada a la acción suave.
No uses frases vacías; cada párrafo debe aportar valor real.

FORMATO DE SALIDA (obligatorio):
- Títulos de sección con ##
- Subtítulos con ### si los hubiera
- Texto en **negrita** para conceptos clave
- Listas con - al inicio de cada ítem
- Citas destacadas con > al inicio
- Párrafos separados por línea en blanco
- NO incluyas el título principal en el cuerpo, solo las secciones
- Empieza directamente con el contenido, sin preámbulos`

  const userPrompt = `Tema: ${tema}${ideas?.trim() ? `\n\nIdeas o puntos a incluir: ${ideas}` : ''}`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Groq error:', err)
      return res.status(500).json({ error: 'Error al generar el contenido' })
    }

    const data = await response.json()
    const markdown = data.choices?.[0]?.message?.content ?? ''
    return res.status(200).json({ markdown })
  } catch (err) {
    console.error('Error:', err)
    return res.status(500).json({ error: 'Error de conexión con la IA' })
  }
}
