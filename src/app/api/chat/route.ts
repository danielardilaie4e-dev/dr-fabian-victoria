import { NextRequest, NextResponse } from 'next/server'

const SITE_CONTEXT = `
Eres un asistente virtual del Dr. Fabian Victoria, cirujano plástico en Cali, Colombia.
Debes responder preguntas sobre procedimientos, valoraciones y cuidados basándote ESTRICTAMENTE en la siguiente información.
Si no sabes la respuesta, indica que el paciente debe agendar una valoración.
Nunca des diagnósticos ni garantices resultados. Mantén un tono profesional, empático y claro.

INFORMACIÓN DEL CONSULTORIO:
- Nombre: Dr. Fabián Efrén Victoria Ardila
- Especialidad: Cirugía Plástica, Estética y Reconstructiva
- Ubicación: Cali, Colombia
- Contacto: WhatsApp +57 320 911 5240
- Formación: Universidad del Valle, Miembro SCCP (Sociedad Colombiana de Cirugía Plástica)
- Enfoque: Valoración individual, seguridad del paciente, seguimiento continuo

PROCEDIMIENTOS:
1. Valoración médica personalizada - Consulta inicial para conocer el caso, revisar expectativas y definir si existe indicación médica.
2. Liposucción y lipoescultura - Remodelación del contorno corporal. No es un tratamiento para bajar de peso.
3. Mamoplastia - Aumento, reducción, levantamiento o remodelación mamaria según anatomía y necesidades.
4. Abdominoplastia - Corrección de exceso de piel y flacidez abdominal post-embarazo o pérdida de peso.
5. Blefaroplastia - Mejora el aspecto de los párpados y la mirada.
6. Rinoplastia - Armonización nasal con valoración anatómica y funcional.
7. Labioplastia - Cirugía íntima femenina con enfoque en comodidad y privacidad.
8. Mommy Makeover - Plan integral post-embarazo que combina procedimientos corporales y mamarios.
9. Cirugía reconstructiva - Restauración de forma y función en casos de trauma o secuelas.

PREGUNTAS FRECUENTES:
- ¿La valoración es obligatoria? Sí. Ningún procedimiento debe definirse sin evaluación individual.
- ¿Precios por WhatsApp? Orientación inicial, pero el valor final depende de la valoración médica.
- ¿Resultados iguales para todos? No. Varían según anatomía, salud, técnica y cuidados.
- ¿Tiempo de recuperación? Depende del procedimiento y del paciente.
- ¿Liposucción para bajar de peso? No, es un procedimiento de contorno corporal.
- ¿Seguimiento postoperatorio? Incluye controles médicos según el procedimiento.
- ¿Combinar procedimientos? En algunos casos sí, depende de la valoración médica.
- ¿Fotos antes y después? Con autorización del paciente y respeto por la privacidad.

NOTAS IMPORTANTES:
- Los resultados varían según anatomía, condiciones de salud, técnica, recuperación y cuidados postoperatorios.
- La información es orientativa y no reemplaza una valoración médica presencial.
- Cada paciente requiere evaluación individual.
`.trim()

async function queryAI(message: string): Promise<string | null> {
  const apiKey = process.env['OPENAI_API_KEY']

  if (!apiKey) return null

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SITE_CONTEXT },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.choices?.[0]?.message?.content || null
}

function keywordFallback(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes('valoración') || msg.includes('consulta') || msg.includes('cita') || msg.includes('agendar')) {
    return 'La valoración médica es el primer paso. Es una consulta donde se revisa tu caso, expectativas y se determina si hay indicación médica. Puedes agendarla escribiéndonos al WhatsApp +57 320 911 5240.'
  }

  if (msg.includes('precio') || msg.includes('costo') || msg.includes('valor') || msg.includes('cuánto')) {
    return 'El valor del procedimiento depende del tipo de cirugía, la complejidad del caso y las necesidades individuales. Te recomiendo agendar una valoración para recibir un presupuesto personalizado. Escríbenos al WhatsApp +57 320 911 5240.'
  }

  if (msg.includes('liposucción') || msg.includes('lipoescultura') || msg.includes('grasa')) {
    return 'La liposucción y lipoescultura son procedimientos de contorno corporal que remodelan zonas específicas. No deben entenderse como un tratamiento para bajar de peso. Los resultados dependen de la anatomía y evaluación individual.'
  }

  if (msg.includes('mama') || msg.includes('mamoplastia') || msg.includes('seno') || msg.includes('aumento')) {
    return 'La mamoplastia incluye aumento, reducción, levantamiento o remodelación mamaria. Cada caso se evalúa de forma individual para determinar la técnica más adecuada según tu anatomía y expectativas.'
  }

  if (msg.includes('recuperación') || msg.includes('postoperatorio') || msg.includes('reposo') || msg.includes('cuánto tiempo')) {
    return 'El tiempo de recuperación varía según el procedimiento y las condiciones de cada paciente. En la valoración médica se explican los tiempos estimados, cuidados, restricciones y controles necesarios.'
  }

  if (msg.includes('abdominoplastia') || msg.includes('abdomen') || msg.includes('barriga') || msg.includes('piel')) {
    return 'La abdominoplastia corrige el exceso de piel y la flacidez abdominal, comúnmente después del embarazo o una pérdida significativa de peso. Requiere evaluación individual para determinar si eres candidato.'
  }

  if (msg.includes('rinoplastia') || msg.includes('nariz')) {
    return 'La rinoplastia busca armonizar la nariz con el rostro, evaluando tanto la parte anatómica como funcional. Se requiere una valoración para determinar el enfoque adecuado.'
  }

  if (msg.includes('blefaroplastia') || msg.includes('párpado') || msg.includes('mirada') || msg.includes('ojos')) {
    return 'La blefaroplastia mejora el aspecto de los párpados superiores e inferiores, eliminando el exceso de piel y bolsas. Ayuda a rejuvenecer la mirada.'
  }

  return 'Gracias por tu consulta. Para darte una respuesta precisa, te recomiendo agendar una valoración médica personalizada donde podremos revisar tu caso en detalle. Escríbenos al WhatsApp +57 320 911 5240 y con gusto te orientaremos.'
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    const trimmed = message.trim().slice(0, 1000)

    const aiResponse = await queryAI(trimmed)
    const response = aiResponse || keywordFallback(trimmed)

    return NextResponse.json({ response })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
