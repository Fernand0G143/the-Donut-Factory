# The Donut Factory

**The Donut Factory** es un panel administrativo moderno para gestionar pedidos, ventas, producción, clientes y configuración de una tienda de donas. Está construido con **Next.js 16**, **React 19**, **TypeScript** y utiliza **PostgreSQL** como backend de datos.

---

## 🚀 Qué hace este proyecto

La aplicación ofrece un dashboard completo para la administración de una pastelería/donutería con:

- Gestión de pedidos con filtrado, estado y CRUD de pedidos.
- Panel de ventas con métricas, filtros y listado de pedidos entregados.
- Control de producción por sabor: añadir, editar y eliminar sabores.
- Gestión de clientes con estadísticas de clientes frecuentes y nuevos.
- Configuración con modo oscuro para una experiencia de trabajo nocturna.
- API internas en `app/api` conectadas a una base de datos PostgreSQL.

---

## ✨ Funcionalidades destacadas

### Panel de Administración

- `app/admin/pedidos/page.tsx` — Gestión de pedidos activos y edición de estados.
- `app/admin/ventas/page.tsx` — Reportes de ventas, filtros y métricas de desempeño.
- `app/admin/produccion/page.tsx` — Administración de sabores, existencias y precios.
- `app/admin/clientes/page.tsx` — Estadísticas de clientes y listado completo de clientes.
- `app/admin/configuracion/page.tsx` — Activación de `Darkmode` y ajustes generales.

### Componentes y vistas

- `components/MainMenu.tsx` — Navegación entre áreas administrativas.
- `components/HistorialClientes.tsx` — Historial y comportamiento de clientes.
- `components/SpecialDatesFilter.tsx` — Filtros por fechas especiales para clientes.
- `components/CustomBoxesTable.tsx` — Vistas de producción y caja personalizada.

### Rutas API

- `app/api/orders/route.ts` — Manejo de pedidos: crear, actualizar, eliminar y limpiar.
- `app/api/production/route.ts` — Actualizaciones de producción por sabor.
- `app/api/customers/route.ts` — Estadísticas y datos de clientes.
- `app/api/ventas/route.ts` — Cálculo de ingresos y resumen de ventas.

---

## 🛠️ Tecnologías usadas

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS (configuración PostCSS/Tailwind)
- PostgreSQL
- `pg` para conexión a la base de datos
- ESLint para calidad de código

---

## 📦 Instalación local

1. Clonar el repositorio:

```bash
git clone https://github.com/Fernand0G143/the-Donut-Factory.git
cd the-Donut-Factory
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo de entorno `.env` con la cadena de conexión a PostgreSQL:

```dotenv
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_base"
```

> En este repositorio se usa `DATABASE_URL` para conectar con PostgreSQL.

4. Levantar la aplicación en modo desarrollo:

```bash
npm run dev
```

5. Abrir la app en el navegador:

```text
http://localhost:3000
```

---

## 🧪 Scripts disponibles

- `npm run dev` — Inicia el servidor de desarrollo.
- `npm run build` — Genera la versión de producción.
- `npm run start` — Inicia el servidor Next.js en producción.
- `npm run lint` — Ejecuta ESLint para revisar el código.
- `npm run smoke:test` — Ejecuta una prueba de humo con `scripts/test-orders.js`.

---

## 🧾 Estructura principal del proyecto

- `app/` — Rutas y páginas del frontend.
- `app/admin/` — Dashboard administrador y páginas internas.
- `app/api/` — Endpoints API para pedidos, producción, clientes y ventas.
- `components/` — Componentes reutilizables de UI.
- `styles/` — Estilos globales y CSS específicos de páginas.
- `lib/db.ts` — Conexión a PostgreSQL.

---

## 💡 Cómo contribuir

1. Crear una rama nueva:

```bash
git checkout -b feature/nueva-mejora
```

2. Realizar cambios y probar localmente.
3. Hacer commit con mensajes claros:

```bash
git add .
git commit -m "feat: agregar filtro avanzado en ventas"
```

4. Enviar la rama al repositorio remoto:

```bash
git push origin feature/nueva-mejora
```

---

## ✅ Qué puedes mejorar

- Conectar un sistema real de autenticación para el panel admin.
- Añadir validación de formularios con `Zod` o `Yup`.
- Mejorar el dashboard con gráficos de ventas dinámicos.
- Añadir tests end-to-end con Cypress o Playwright.

---

## 📌 Notas finales

Este proyecto es ideal para administrar una tienda de donas con un flujo completo de pedidos, producción y ventas. Su arquitectura basada en Next.js facilita agregar nuevas páginas, mejoras en UX y más integraciones de datos.

¡Listo para subir al siguiente nivel y convertirlo en la suite administrativa definitiva para una donutería!