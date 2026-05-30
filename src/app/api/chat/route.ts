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

  const matchKeywords = (patterns: string[][], responses: string[]): string | null => {
    for (let i = 0; i < patterns.length; i++) {
      if (patterns[i].some((p) => msg.includes(p))) {
        const idx = Math.min(i, responses.length - 1)
        return responses[idx]
      }
    }
    return null
  }

  const r = {
    valoracion: [
      'La valoración médica es el primer paso y es obligatoria antes de cualquier procedimiento. En esta consulta se revisa tu caso, antecedentes, expectativas y se determina si hay indicación médica. No tiene costo de compromiso y puedes agendarla escribiéndonos al WhatsApp +57 320 911 5240.',
      '¡Claro! La valoración es una consulta personalizada donde el Dr. Fabian Victoria evalúa tu caso, resuelve tus dudas y define el mejor plan para ti. Puedes solicitar la tuya por WhatsApp +57 320 911 5240.',
    ],
    precio: [
      'El costo de cada procedimiento depende del tipo de cirugía, la complejidad del caso, las necesidades individuales y los honorarios del equipo médico. Te recomiendo agendar una valoración para recibir un presupuesto personalizado sin compromiso. Escríbenos al WhatsApp +57 320 911 5240.',
      'Entendemos que el factor económico es importante. En la valoración recibirás información detallada sobre costos, formas de pago y opciones disponibles. Cada caso es único y el presupuesto se ajusta a tus necesidades específicas.',
    ],
    lipo: [
      'La liposucción y lipoescultura son procedimientos de contorno corporal que eliminan depósitos de grasa localizada en zonas específicas como abdomen, caderas, muslos o brazos. No deben entenderse como un método para bajar de peso. Los resultados dependen de la anatomía, elasticidad de la piel y las condiciones de cada paciente.',
      'La lipoescultura no solo elimina grasa, sino que también redefine la silueta corporal. Es ideal para personas con peso estable que tienen depósitos de grasa resistentes al ejercicio. Se requiere una valoración para determinar si eres candidato.',
    ],
    mama: [
      'La mamoplastia abarca varios procedimientos: aumento con implantes, reducción mamaria, levantamiento (mastopexia) y remodelación. Cada caso se evalúa de forma individual para determinar la técnica más adecuada según tu anatomía, expectativas y necesidades. Los resultados son naturales cuando se planifican correctamente.',
      'La cirugía de mamas puede transformar tu silueta y autoestima. Ya sea aumento, reducción o levantamiento, el Dr. Fabian Victoria evalúa tu caso para recomendar la mejor opción. Agenda tu valoración para conocer las alternativas.',
    ],
    recuperacion: [
      'El tiempo de recuperación varía según el tipo de procedimiento y las condiciones de cada paciente. En términos generales, los primeros días requieren reposo relativo, y entre la primera y segunda semana se puede retomar actividades ligeras. El ejercicio intenso puede esperar de 4 a 8 semanas. En la valoración se explican los tiempos estimados para tu caso específico, junto con los cuidados, restricciones y controles necesarios.',
      'La recuperación es un proceso importante. Durante la valoración, el Dr. Victoria te explicará detalladamente qué esperar: medicación, cuidados de las incisiones, prendas de compresión, controles postoperatorios y señales de alerta. Cada paciente tiene un plan de recuperación personalizado.',
    ],
    abdominoplastia: [
      'La abdominoplastia corrige el exceso de piel y la flacidez abdominal. Es común después del embarazo o de una pérdida significativa de peso. También puede incluir reparación de los músculos abdominales cuando están separados (diástasis). Se requiere una evaluación individual para determinar si eres candidato y explicar los resultados esperados.',
      'La cirugía de abdomen no es un procedimiento para bajar de peso, sino para remodelar y tensar la pared abdominal. Los mejores resultados se obtienen en personas con peso estable y buena salud general.',
    ],
    nariz: [
      'La rinoplastia busca armonizar la nariz con el rostro, mejorando tanto la estética como la función respiratoria. El Dr. Fabian Victoria evalúa la anatomía nasal interna y externa para determinar el enfoque adecuado. Los resultados son naturales y proporcionados a cada paciente.',
      'La cirugía de nariz puede mejorar la respiración y la apariencia facial al mismo tiempo. Se requiere una valoración detallada para entender tus objetivos y determinar si eres candidato.',
    ],
    parpados: [
      'La blefaroplastia mejora el aspecto de los párpados superiores e inferiores, eliminando el exceso de piel, bolsas grasosas y arrugas. Ayuda a rejuvenecer la mirada y, en algunos casos, puede mejorar el campo visual cuando el párpado superior cae. Es un procedimiento ambulatorio con recuperación relativamente rápida.',
      'Si sientes que tu mirada se ve cansada o los párpados tienen exceso de piel, la blefaroplastia puede ser una opción. Los resultados son naturales y duraderos. Agenda tu valoración para conocer más.',
    ],
    cicatriz: [
      'Toda cirugía deja cicatrices, pero el Dr. Fabian Victoria realiza incisiones en zonas estratégicas para que sean lo menos visibles posible (pliegues naturales, líneas de tensión mínima). Con el tiempo y los cuidados adecuados (protección solar, masajes, silicona), las cicatrices tienden a atenuarse significativamente.',
      'El manejo de cicatrices es parte fundamental del resultado final. Durante el postoperatorio se dan indicaciones precisas para optimizar la cicatrización. La genética y los cuidados del paciente influyen en el resultado.',
    ],
    edad: [
      'No hay una edad única para someterse a una cirugía plástica. Se requiere ser mayor de edad y tener un desarrollo anatómico completo. Más importante que la edad cronológica son la salud general, las expectativas realistas y la motivación del paciente. Cada caso se evalúa individualmente.',
      'La edad ideal depende más de tu salud y necesidades que de un número. Personas de diferentes edades se benefician de la cirugía plástica cuando están en buenas condiciones de salud y tienen expectativas claras.',
    ],
    ejercicio: [
      'El retorno al ejercicio depende del tipo de procedimiento. Generalmente se recomienda: caminar desde el día siguiente, actividades ligeras después de 2 semanas, y ejercicio intenso (pesas, cardio fuerte) entre 4 y 8 semanas. El Dr. Victoria dará indicaciones precisas según tu caso.',
      'Es importante no apresurar el retorno al ejercicio para evitar complicaciones. Escucha a tu cuerpo y sigue las indicaciones médicas. Cada procedimiento tiene tiempos diferentes.',
    ],
    tabaco: [
      'El tabaco afecta significativamente la cicatrización y aumenta el riesgo de complicaciones como necrosis de la piel, infecciones y mala calidad de las cicatrices. Se recomienda suspender su uso al menos 4 semanas antes y 4 semanas después de cualquier cirugía. Es una recomendación médica estricta, no opcional.',
      'Fumar interfiere con el flujo sanguíneo necesario para una buena cicatrización. Los cirujanos generalmente exigen la suspensión del tabaco antes de operar. Es por tu seguridad y para garantizar los mejores resultados.',
    ],
    dolor: [
      'Los procedimientos se realizan bajo anestesia (local, regional o general), por lo que no sentirás dolor durante la cirugía. En el postoperatorio, se maneja el dolor con medicamentos orales o intravenosos según la necesidad. La mayoría de los pacientes reportan molestias manejables, no dolor intenso.',
      'El control del dolor es una prioridad. Se utilizan protocolos de analgesia multimodal para mantenerte cómodo durante la recuperación. Cualquier molestia se trata de forma oportuna.',
    ],
    riesgo: [
      'Como toda cirugía, existen riesgos que se explican detalladamente durante la valoración: sangrado, infección, reacciones a la anestesia, mala cicatrización, asimetrías, etc. La evaluación prequirúrgica (exámenes, historia clínica, valoración cardiológica si aplica) permite minimizar estos riesgos y determinar si el paciente está en condiciones óptimas.',
      'La seguridad del paciente es la prioridad número uno. El Dr. Victoria realiza una evaluación completa antes de cualquier procedimiento para identificar y mitigar riesgos. Todas las dudas sobre riesgos se resuelven en la valoración.',
    ],
    eps: [
      'La cirugía estética no está cubierta por el sistema de salud colombiano (EPS). Los costos son asumidos por el paciente. Para cirugías reconstructivas (post-trauma, post-oncológicas, malformaciones), aplican otros criterios y pueden tener cobertura parcial. Esto se determina en la valoración médica.',
      'Si tu procedimiento tiene un componente reconstructivo, puede haber opciones de cobertura. El Dr. Victoria evalúa cada caso y te orienta sobre los pasos a seguir.',
    ],
    mommy: [
      'El Mommy Makeover es un plan integral de procedimientos combinados diseñado para mujeres después del embarazo y la lactancia. Puede incluir abdominoplastia, aumento o levantamiento mamario, liposucción y otros procedimientos según las necesidades de cada paciente. Se realiza en una o varias cirugías, según la valoración médica y la seguridad del paciente.',
      'El embarazo transforma el cuerpo. El Mommy Makeover está diseñado para ayudarte a recuperar tu silueta y confianza. Cada plan es único y se construye alrededor de tus necesidades específicas.',
    ],
    pregunta: [
      '¡Excelente pregunta! Para darte una respuesta precisa y personalizada, te recomiendo agendar una valoración médica con el Dr. Fabian Victoria. Mientras tanto, puedes escribirnos al WhatsApp +57 320 911 5240 y con gusto resolveremos tus inquietudes iniciales.',
      'Entiendo tu curiosidad. La mejor manera de obtener información clara y confiable es mediante una valoración presencial, donde podremos revisar tu caso en detalle. Escríbenos al WhatsApp y te guiaremos en el proceso.',
    ],
  }

  const categories = [
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

  return 'Gracias por tu consulta. Para darte una respuesta precisa y personalizada, te recomiendo agendar una valoración médica con el Dr. Fabian Victoria. Escríbenos al WhatsApp +57 320 911 5240 y con gusto resolveremos tus dudas.'
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
