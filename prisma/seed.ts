import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@drfabianvictoria.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123456'

  const existing = await prisma.admin.findUnique({ where: { email } })
  if (!existing) {
    const hashed = await bcrypt.hash(password, 12)
    await prisma.admin.create({
      data: { email, password: hashed, name: 'Dr. Fabian Victoria' },
    })
    console.log('Admin user created:', email)
  } else {
    console.log('Admin user already exists:', email)
  }

  const heroContent = [
    { section: 'hero', key: 'headline', value: 'Cirugía plástica con precisión médica, estética natural y acompañamiento personalizado' },
    { section: 'hero', key: 'subheadline', value: 'El Dr. Fabian Victoria brinda atención en cirugía plástica, estética y reconstructiva en Cali.' },
    { section: 'about', key: 'body', value: 'El Dr. Fabián Efrén Victoria Ardila es cirujano plástico en Cali, enfocado en procedimientos estéticos y reconstructivos.' },
    { section: 'trust', key: 'intro', value: 'Tu seguridad es parte central del proceso.' },
    { section: 'valuation', key: 'intro', value: 'La valoración médica es el primer paso para entender qué necesitas realmente.' },
    { section: 'faq', key: 'intro', value: 'Antes de decidir, es normal tener preguntas.' },
    { section: 'final_cta', key: 'headline', value: 'Da el primer paso con una valoración médica personalizada.' },
  ]

  for (const item of heroContent) {
    const exists = await prisma.siteContent.findUnique({
      where: { section_key: { section: item.section, key: item.key } },
    })
    if (!exists) {
      await prisma.siteContent.create({ data: item })
    }
  }

  console.log('Site content seeded')

  const procedures = [
    {
      name: 'Valoración médica personalizada',
      category: 'consulta médica',
      description: 'Consulta inicial para conocer el caso del paciente, revisar expectativas, antecedentes y definir si existe indicación médica para un procedimiento.',
      benefits: ['Orientación médica individual', 'Revisión de expectativas reales', 'Planeación quirúrgica responsable', 'Resolución de dudas'],
      steps: ['Agendamiento por WhatsApp', 'Registro de datos', 'Evaluación médica', 'Revisión de expectativas', 'Definición de próximos pasos'],
      cta: 'Agenda tu valoración',
      commercialPriority: 'alta',
      order: 0,
    },
    {
      name: 'Liposucción y lipoescultura',
      category: 'corporal',
      description: 'Procedimiento quirúrgico orientado a retirar grasa localizada y mejorar el contorno corporal en pacientes adecuadamente valorados.',
      benefits: ['Mejora del contorno corporal', 'Mayor definición de zonas específicas', 'Planeación personalizada'],
      steps: ['Valoración médica', 'Análisis de zonas', 'Planeación quirúrgica', 'Procedimiento', 'Seguimiento'],
      cta: 'Consulta si eres candidato',
      commercialPriority: 'alta',
      order: 1,
    },
    {
      name: 'Mamoplastia',
      category: 'mamaria',
      description: 'Procedimientos mamarios que pueden incluir aumento, reducción, levantamiento o remodelación, según la necesidad del paciente.',
      benefits: ['Armonización corporal', 'Corrección de volumen o forma', 'Opciones personalizadas'],
      steps: ['Valoración', 'Análisis de proporción', 'Definición del tipo', 'Procedimiento', 'Seguimiento'],
      cta: 'Solicita valoración mamaria',
      commercialPriority: 'alta',
      order: 2,
    },
    {
      name: 'Abdominoplastia',
      category: 'corporal',
      description: 'Corrección de exceso de piel y flacidez abdominal en pacientes seleccionados, especialmente post-embarazo o pérdida de peso.',
      benefits: ['Mejora del contorno abdominal', 'Retiro de exceso de piel', 'Posible reparación muscular'],
      steps: ['Valoración', 'Evaluación de flacidez', 'Planeación', 'Procedimiento', 'Cuidados postoperatorios'],
      cta: 'Evalúa tu caso',
      commercialPriority: 'alta',
      order: 3,
    },
  ]

  for (const proc of procedures) {
    const exists = await prisma.procedure.findFirst({ where: { name: proc.name } })
    if (!exists) {
      await prisma.procedure.create({ data: proc })
    }
  }

  console.log('Procedures seeded')

  const faqs = [
    { question: '¿La valoración médica es obligatoria antes de una cirugía plástica?', answer: 'Sí. La valoración permite revisar tu caso, antecedentes, expectativas, riesgos y opciones.', order: 0 },
    { question: '¿Los resultados son iguales para todos los pacientes?', answer: 'No. Los resultados varían según anatomía, salud, técnica, recuperación y características individuales.', order: 1 },
    { question: '¿Cuánto tarda la recuperación?', answer: 'Depende del procedimiento y del paciente. En la valoración se explican tiempos estimados y cuidados.', order: 2 },
  ]

  for (const faq of faqs) {
    const exists = await prisma.fAQ.findFirst({ where: { question: faq.question } })
    if (!exists) {
      await prisma.fAQ.create({ data: faq })
    }
  }

  console.log('FAQs seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
