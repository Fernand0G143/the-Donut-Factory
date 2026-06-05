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

> Si al ejecutar `npm run dev` o `npm run build` aparece el error `Module not found: Can't resolve 'pg'`, vuelve a correr:
>
> ```bash
> npm install
> ```
>
> y si aún persiste:
>
> ```bash
> npm install pg
> ```
>
3. Copiar el ejemplo de entorno y personalizarlo si es necesario:

```bash
copy .env.example .env
```

> El archivo `.env.example` incluye los valores de `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB` usados por PostgreSQL.

4. Iniciar Docker Compose:

```bash
docker compose up -d
```

El servicio `db` crea un contenedor llamado `donut_factory_container`.

5. Verificar que el contenedor esté en ejecución:

```bash
docker ps --filter "name=donut_factory_container"
```

6. Comprobar los logs de PostgreSQL:

```bash
docker compose logs -f db
```

> Para detener los servicios cuando termines, usa:

```bash
docker compose down
```

7. Levantar la aplicación en modo desarrollo:

```bash
npm run dev
```

8. Abrir la app en el navegador:

```text
http://localhost:3000
```

---

## 🗄️ Base de datos y tablas

El contenedor PostgreSQL arranca con el nombre `donut_factory_container` y utiliza la base de datos `donuts_db`.

Las tablas creadas para el proyecto son:

- `clientes`
- `pedidos`
- `produccion`
- `ventas`

Si necesitas crear la base de datos y las tablas manualmente, usa estos comandos:

```bash
docker exec -i donut_factory_container psql -U donuts -d postgres -c "CREATE DATABASE donuts_db;"

docker exec -i donut_factory_container psql -U donuts -d donuts_db -c "CREATE TABLE IF NOT EXISTS clientes (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, correo TEXT UNIQUE, telefono TEXT, creado_en TIMESTAMPTZ DEFAULT now()); CREATE TABLE IF NOT EXISTS pedidos (id SERIAL PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL, estado TEXT NOT NULL DEFAULT 'pendiente', total NUMERIC(10,2) DEFAULT 0, creado_en TIMESTAMPTZ DEFAULT now()); CREATE TABLE IF NOT EXISTS produccion (id SERIAL PRIMARY KEY, sabor TEXT NOT NULL, stock INTEGER DEFAULT 0, precio NUMERIC(7,2) DEFAULT 0, actualizado_en TIMESTAMPTZ DEFAULT now()); CREATE TABLE IF NOT EXISTS ventas (id SERIAL PRIMARY KEY, pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE, monto NUMERIC(10,2) NOT NULL, vendido_en TIMESTAMPTZ DEFAULT now()); CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);"
```

Y para verificar que las tablas existen:

```bash
docker exec -i donut_factory_container psql -U donuts -d donuts_db -c "\dt"
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