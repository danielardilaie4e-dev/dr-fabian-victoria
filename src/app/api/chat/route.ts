import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const BASE_CONTEXT = `
Eres un asistente virtual del Dr. Fabian Victoria, cirujano plástico en Cali, Colombia.
Debes responder preguntas sobre procedimientos, valoraciones y cuidados basándote ESTRICTAMENTE en la información proporcionada.
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
- ¿Duele? Se maneja con anestesia y analgesia postoperatoria.
- ¿Edad mínima? Mayoría de edad y desarrollo completo.
- ¿Cicatrices? Se minimizan con incisiones estratégicas.
- ¿Ejercicio post-cirugía? Entre 4 y 8 semanas según el caso.
- ¿Tabaco? Afecta la cicatrización, debe suspenderse.
- ¿EPS cubre cirugía estética? No, es privada.

NOTAS IMPORTANTES:
- Los resultados varían según anatomía, condiciones de salud, técnica, recuperación y cuidados postoperatorios.
- La información es orientativa y no reemplaza una valoración médica presencial.
- Cada paciente requiere evaluación individual.
`.trim()

async function searchKnowledge(query: string): Promise<string> {
  try {
    const docs = await prisma.knowledgeDocument.findMany()
    const q = query.toLowerCase()
    const words = q.split(/\s+/).filter((w) => w.length > 2)

    const scored = docs.map((doc) => {
      const content = (doc.title + ' ' + doc.content).toLowerCase()
      let score = 0
      for (const word of words) {
        if (content.includes(word)) score++
      }
      if (doc.category && q.includes(doc.category.toLowerCase())) score += 3
      return { doc, score }
    })

    const relevant = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    if (relevant.length === 0) return ''

    return relevant
      .map((s) => `[DOCUMENTO: ${s.doc.title}${s.doc.category ? ` (${s.doc.category})` : ''}]\n${s.doc.content}`)
      .join('\n\n')
  } catch {
    return ''
  }
}

async function queryAI(message: string, knowledgeContext: string): Promise<string | null> {
  const apiKey = process.env['OPENAI_API_KEY']
  if (!apiKey) return null

  const systemContent = knowledgeContext
    ? `${BASE_CONTEXT}\n\nDOCUMENTOS DE REFERENCIA ADICIONALES (proporcionados por el consultorio):\n${knowledgeContext}\n\nUsa estos documentos como fuente prioritaria al responder. Si el usuario pregunta sobre temas cubiertos en estos documentos, responde basándote en ellos. Siempre que uses información de un documento, menciónalo por su título.`
    : BASE_CONTEXT

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: message },
      ],
      max_tokens: 800,
      temperature: 0.3,
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content || null
}

function keywordFallback(message: string, knowledgeContext: string): string {
  const msg = message.toLowerCase()

  if (knowledgeContext) {
    const firstDoc = knowledgeContext.split('\n')[0]?.replace('[DOCUMENTO: ', '').replace(']', '') || ''
    const previewLines = knowledgeContext.split('\n').slice(1, 5).join('\n')
    return `Según la información disponible en el documento "${firstDoc}" que el Dr. Fabian Victoria ha proporcionado:\n\n${previewLines}\n\nSi necesitas más detalles, te recomiendo agendar una valoración personalizada. Escríbenos al WhatsApp +57 320 911 5240.`
  }

  const r = {
    valoracion: [
      'La valoración médica es el primer paso y es obligatoria antes de cualquier procedimiento. En esta consulta se revisa tu caso, antecedentes, expectativas y se determina si hay indicación médica. Puedes agendarla al WhatsApp +57 320 911 5240.',
      'La valoración es una consulta personalizada donde el Dr. Fabian Victoria evalúa tu caso, resuelve tus dudas y define el mejor plan para ti.',
    ],
    precio: [
      'El costo del procedimiento depende del tipo de cirugía, la complejidad del caso y las necesidades individuales. En la valoración recibirás un presupuesto personalizado. Escríbenos al WhatsApp +57 320 911 5240.',
      'Los precios varían según cada caso. Te recomiendo agendar una valoración para recibir información detallada sobre costos y formas de pago.',
    ],
    lipo: [
      'La liposucción y lipoescultura remodelan el contorno corporal eliminando grasa localizada. No son tratamientos para bajar de peso. Los resultados dependen de la anatomía y evaluación individual.',
      'La lipoescultura redefine la silueta corporal. Es ideal para personas con peso estable que tienen depósitos de grasa resistentes al ejercicio.',
    ],
    mama: [
      'La mamoplastia incluye aumento con implantes, reducción mamaria, levantamiento (mastopexia) y remodelación. Cada caso se evalúa individualmente para determinar la técnica más adecuada.',
      'La cirugía de mamas puede transformar tu silueta y autoestima. El Dr. Fabian Victoria evalúa tu caso para recomendar la mejor opción.',
    ],
    recuperacion: [
      'El tiempo de recuperación varía según el procedimiento. Generalmente: primeros días de reposo, actividades ligeras a las 2 semanas, ejercicio intenso de 4 a 8 semanas. En la valoración se explican los tiempos para tu caso específico.',
      'La recuperación incluye cuidados de incisiones, medicación, prendas de compresión y controles postoperatorios. Cada paciente tiene un plan personalizado.',
    ],
    abdominoplastia: [
      'La abdominoplastia corrige el exceso de piel y flacidez abdominal, común después del embarazo o pérdida de peso significativa. Puede incluir reparación de diástasis de los rectos abdominales.',
      'La cirugía de abdomen remodela y tensa la pared abdominal. Los mejores resultados se obtienen en personas con peso estable y buena salud.',
    ],
    nariz: [
      'La rinoplastia armoniza la nariz con el rostro, mejorando estética y función respiratoria. Se evalúa la anatomía nasal interna y externa para determinar el enfoque adecuado.',
      'La cirugía de nariz puede mejorar la respiración y la apariencia facial simultáneamente.',
    ],
    parpados: [
      'La blefaroplastia rejuvenece la mirada eliminando exceso de piel y bolsas en los párpados. Es ambulatoria con recuperación relativamente rápida.',
      'Si sientes que tu mirada se ve cansada, la blefaroplastia puede ser una opción. Los resultados son naturales y duraderos.',
    ],
    cicatriz: [
      'Toda cirugía deja cicatrices, pero se realizan incisiones en zonas estratégicas para que sean lo menos visibles. Con protección solar y cuidados, se atenúan significativamente.',
      'El manejo de cicatrices es parte del resultado final. Se dan indicaciones precisas para optimizar la cicatrización.',
    ],
    edad: [
      'No hay una edad única. Se requiere ser mayor de edad con desarrollo anatómico completo. Más importante que la edad son la salud general y las expectativas realistas.',
      'La edad ideal depende más de tu salud que de un número. Personas de diferentes edades se benefician de la cirugía plástica.',
    ],
    ejercicio: [
      'El retorno al ejercicio depende del procedimiento: caminar desde el día siguiente, actividades ligeras a las 2 semanas, ejercicio intenso de 4 a 8 semanas.',
      'No apresures el retorno al ejercicio. Sigue las indicaciones médicas para evitar complicaciones.',
    ],
    tabaco: [
      'El tabaco afecta la cicatrización y aumenta riesgos de complicaciones. Debe suspenderse al menos 4 semanas antes y 4 semanas después de cualquier cirugía. Es una recomendación médica estricta.',
      'Fumar interfiere con el flujo sanguíneo necesario para la cicatrización. Los cirujanos exigen suspenderlo antes de operar por tu seguridad.',
    ],
    dolor: [
      'Los procedimientos se realizan bajo anestesia, no sentirás dolor durante la cirugía. En el postoperatorio se maneja con medicación. La mayoría reporta molestias manejables.',
      'El control del dolor es una prioridad. Se usan protocolos de analgesia para mantenerte cómodo durante la recuperación.',
    ],
    riesgo: [
      'Como toda cirugía existen riesgos: sangrado, infección, reacciones a la anestesia, mala cicatrización. La evaluación prequirúrgica los minimiza.',
      'La seguridad del paciente es la prioridad. El Dr. Victoria realiza una evaluación completa antes de cualquier procedimiento.',
    ],
    eps: [
      'La cirugía estética no está cubierta por EPS. Los costos son asumidos por el paciente. Para cirugías reconstructivas aplican otros criterios.',
      'Si tu procedimiento tiene componente reconstructivo, puede haber opciones de cobertura. El Dr. Victoria te orientará.',
    ],
    mommy: [
      'El Mommy Makeover combina procedimientos post-embarazo: abdominoplastia, aumento/levantamiento mamario, liposucción. Cada plan es único.',
      'El embarazo transforma el cuerpo. El Mommy Makeover está diseñado para recuperar tu silueta y confianza.',
    ],
    consumir: [
      'Antes de una cirugía plástica, el Dr. Fabian Victoria indica suspender: tabaco (mínimo 4 semanas antes), alcohol (al menos 48 horas antes), anticoagulantes como aspirina, ibuprofeno y algunos suplementos herbales. La noche anterior solo debes consumir líquidos claros hasta 6 horas antes. Todos estos requisitos se explican detalladamente en la valoración prequirúrgica.',
      'La preparación preoperatoria incluye: ayuno de 6-8 horas, suspender tabaco y alcohol, evitar medicamentos anticoagulantes. Recibirás indicaciones precisas durante tu valoración.',
    ],
    que_puedo: [
      'Puedo ayudarte con información sobre cirugía plástica, estética y reconstructiva. Pregúntame sobre procedimientos como liposucción, mamoplastia, abdominoplastia, rinoplastia, blefaroplastia, cuidados pre y postoperatorios, valoraciones médicas y más. Si tengo la información en mi base de conocimiento, te responderé con detalles. De lo contrario, te recomendaré agendar una valoración.',
      '¡Claro! Estoy aquí para resolver tus dudas sobre cirugía plástica. Puedo hablarte de procedimientos, recuperación, cuidados, requisitos y más. ¿Qué te gustaría saber?',
    ],
  }

  const categories = [
    { patterns: ['consumir', 'dejar de', 'suspender', 'ayuno', 'comer', 'beber', 'alcohol', 'medicamento', 'pastilla', 'preoperatorio', 'pre-cirugía', 'antes de la cirugía', 'preparación', 'prepararme'], key: 'consumir' },
    { patterns: ['puedes', 'puedes responder', 'qué puedes', 'que haces', 'ayuda', 'información', 'todo'], key: 'que_puedo' },
    { patterns: ['valoración', 'consulta', 'cita', 'agendar', 'primer paso', 'evaluación', 'diagnóstico', 'presencial'], key: 'valoracion' },
    { patterns: ['precio', 'costo', 'valor', 'cuánto', 'presupuesto', 'tarifa', 'pago', 'financiación', 'cuota', 'pagas', 'costos'], key: 'precio' },
    { patterns: ['lipo', 'grasa', 'contorno', 'silueta', 'cintura', 'cartucheras', 'abdomen grasa'], key: 'lipo' },
    { patterns: ['mama', 'mamoplastia', 'seno', 'aumento', 'implante', 'reducción mama', 'pecho', 'mastopexia', 'levantamiento mama', 'prótesis'], key: 'mama' },
    { patterns: ['recuperación', 'postoperatorio', 'reposo', 'cuánto tiempo', 'volver', 'reincorporación', 'días', 'semanas', 'incapacidad'], key: 'recuperacion' },
    { patterns: ['abdominoplastia', 'abdomen', 'barriga', 'piel', 'diástasis', 'rectos', 'flacidez abdominal', 'vientre'], key: 'abdominoplastia' },
    { patterns: ['rinoplastia', 'nariz', 'nasal', 'respiración', 'tabique'], key: 'nariz' },
    { patterns: ['blefaroplastia', 'párpado', 'mirada', 'ojos', 'bolsas', 'ojeras', 'parpado caído'], key: 'parpados' },
    { patterns: ['cicatriz', 'marca', 'incisión', 'visible', 'corte', 'herida'], key: 'cicatriz' },
    { patterns: ['edad', 'años', 'menor', 'joven', 'mayor', 'aplico'], key: 'edad' },
    { patterns: ['ejercicio', 'gimnasio', 'deporte', 'peso', 'entrenar', 'entrenamiento', 'actividad física', 'cardio'], key: 'ejercicio' },
    { patterns: ['tabaco', 'fumar', 'cigarrillo', 'vape', 'nicotina', 'fumador'], key: 'tabaco' },
    { patterns: ['dolor', 'duele', 'molestia', 'anestesia', 'dormido'], key: 'dolor' },
    { patterns: ['riesgo', 'seguro', 'peligro', 'complicación', 'seguridad', 'muerte'], key: 'riesgo' },
    { patterns: ['eps', 'salud', 'cobertura', 'cirugía reconstructiva', 'autorización', 'medicina prepagada'], key: 'eps' },
    { patterns: ['mommy', 'embarazo', 'postparto', 'post-embarazo', 'maternidad', 'hijo', 'bebé'], key: 'mommy' },
    { patterns: ['whatsapp', 'contacto', 'ubicación', 'dirección', 'teléfono', 'llamar', 'consultorio', 'cali', 'dónde queda'], key: 'valoracion' },
  ]

  for (const cat of categories) {
    if (cat.patterns.some((p) => msg.includes(p))) {
      const responses = r[cat.key as keyof typeof r]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  if (knowledgeContext) {
    return `Según la documentación proporcionada por el Dr. Fabian Victoria:\n\n${knowledgeContext.split('\n').slice(1, 8).join('\n')}\n\n¿Te gustaría saber algo más en específico? También puedes agendar una valoración al WhatsApp +57 320 911 5240.`
  }

  return '¡Hola! Soy el asistente virtual del Dr. Fabian Victoria. Puedo ayudarte con información sobre cirugía plástica, estética y reconstructiva. Pregúntame sobre procedimientos específicos, cuidados preoperatorios, recuperación, requisitos y más. ¿En qué puedo ayudarte hoy?'
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    const trimmed = message.trim().slice(0, 1000)

    const knowledgeContext = await searchKnowledge(trimmed)

    const aiResponse = await queryAI(trimmed, knowledgeContext)
    const response = aiResponse || keywordFallback(trimmed, knowledgeContext)

    return NextResponse.json({ response })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
