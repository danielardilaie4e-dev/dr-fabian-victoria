# Dr. Fabian Victoria — Web Platform

Sitio web premium para el Dr. Fabian Victoria, cirujano plástico en Cali, Colombia.

## Stack

- **Framework:** Next.js 16 (App Router)
- **3D:** Three.js + @react-three/fiber + @react-three/drei
- **Estilos:** Tailwind CSS + Framer Motion
- **DB:** PostgreSQL (Railway) + Prisma 7
- **Auth:** iron-session
- **Admin:** Panel completo con CRUD

## Requisitos

- Node.js 20+
- npm
- Cuenta en [Railway](https://railway.app) (base de datos)
- (Opcional) Cuenta en [Vercel](https://vercel.com) para deploy

## Variables de Entorno

Copia `.env.example` a `.env` y completa:

```bash
DATABASE_URL="postgresql://..."
SESSION_PASSWORD="tu-password-seguro-de-32+chars"
ADMIN_EMAIL="admin@drfabianvictoria.com"
ADMIN_PASSWORD="tu-password-admin"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

## Instalación Local

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Despliegue en Producción

### 1. Railway (Base de Datos)
- Crea un proyecto PostgreSQL en Railway
- Copia la URL de conexión a `DATABASE_URL`
- Corre las migraciones:
  ```bash
  npx prisma migrate deploy
  npm run seed
  ```

### 2. Vercel (Frontend + API)
- Conecta tu repo de GitHub a Vercel
- Añade las variables de entorno en Vercel
- Framework: Next.js
- Comando build: `npm run build`
- Comando install: `npm install`

## Admin Panel

Accede a `/admin/login` con las credenciales configuradas en `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

### Secciones del Admin:
- **Dashboard** — Resumen del sitio
- **Procedimientos** — CRUD completo
- **Testimonios** — Gestionar testimonios
- **Preguntas Frecuentes** — CRUD de FAQs
- **Contenido del Sitio** — Editar textos del landing
- **Contactos** — Ver solicitudes recibidas
- **Galería** — Gestionar imágenes

## Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout raíz + DottedSurface 3D
│   ├── page.tsx            # Landing page (10 secciones)
│   ├── admin/              # Panel administrativo
│   └── api/                # API Routes
├── components/
│   ├── three/              # 5 componentes 3D
│   ├── sections/           # Secciones del landing
│   └── ui/                 # Componentes base
└── lib/
    ├── prisma.ts           # Cliente Prisma
    ├── auth.ts             # Autenticación iron-session
    └── utils.ts            # Utilidades
```

## Componentes 3D

1. **DottedSurface** — Fondo animado de partículas doradas
2. **BodyContourViewer** — Torso interactivo con zonas tratables
3. **BreastHarmonyViewer** — Modelo educativo mamario (aumento/reducción/levantamiento)
4. **FacialProfileViewer** — Perfil facial con guías de proporción
5. **ProcessTimeline3D** — Ruta 3D del paciente

## Licencia

Todos los derechos reservados — Dr. Fabian Victoria
