# UdlapPass — Aplicación de Control de Acceso

Sistema de control de acceso para la Universidad de las Américas Puebla (UDLAP). Permite gestionar entradas y salidas del campus mediante códigos QR, credenciales virtuales y registro de accesos.

## Tecnologías

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MySQL2
- **Base de datos:** MariaDB
- **Pruebas:** Cypress (E2E)
- **Librerías:** React Router, Lucide React, Recharts, QRCode.react, @zxing/browser

---

## Requisitos previos

- Node.js 18+
- MariaDB corriendo localmente
- Base de datos `infsoft_db` creada con el schema incluido en `/db`

---

## Instalación

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
```

Crea un archivo `.env` en la carpeta del servidor:

```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=infsoft_db
```

---

## Correr el proyecto

En una terminal, inicia el backend:

```bash
cd server
node index.js
```

En otra terminal, inicia el frontend:

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.
El backend corre en `http://localhost:3000`.

---

## Usuarios demo

| ID / Email | Contraseña | Rol |
|---|---|---|
| `183112` | `1234` | Estudiante |
| `183604` | `1234` | Estudiante |
| `183913` | `1234` | Estudiante |
| `carlos.ruiz@udlap.mx` | `1234` | Empleado |
| `anellisse@udlap.mx` | `1234` | Administrador |

---

## Funcionalidades

### Todos los usuarios
- **Login** con ID de estudiante o email institucional
- **Código QR dinámico** — se regenera cada 30 segundos para registrar accesos
- **Credencial virtual** — muestra nombre, ID, rol, foto y QR estático
- **Escanear Acceso** — escanea el QR fijo de cada entrada/salida del campus y registra automáticamente entrada o salida según el último registro

### Solo Administrador
- **Reportes** — visualiza todos los registros de acceso con gráficas y filtros por rol, tipo y fecha
- **Acceso Manual** — escanea el QR dinámico de un usuario y registra manualmente su entrada o salida indicando la ubicación

---

## Códigos QR de acceso (para impresión)

Cada entrada del campus tiene un QR fijo con este formato:

```json
{"location": "Gaos", "access": "udlap"}
```

| Ubicación | Contenido del QR |
|---|---|
| Gaos | `{"location":"Gaos","access":"udlap"}` |
| Recta | `{"location":"Recta","access":"udlap"}` |
| Periferico | `{"location":"Periferico","access":"udlap"}` |
| Proveedores | `{"location":"Proveedores","access":"udlap"}` |

---

## Pruebas automatizadas

Las pruebas E2E se corren con Cypress. Asegúrate de tener el frontend y backend corriendo antes de ejecutarlas.

```bash
npx cypress open
```

### Archivos de prueba

| Archivo | Qué prueba |
|---|---|
| `login.cy.ts` | Login con credenciales válidas e inválidas |
| `estudiante.cy.ts` | Home, credencial y QR dinámico de los 3 estudiantes |
| `adminEmpleado.cy.ts` | Home, credencial, reportes y filtros del administrador y empleado |
| `scan-access.cy.ts` | Escaneo de acceso, entrada/salida, QR inválido y error del backend |

---

## Estructura del proyecto

```
src/
  app/
    components/
      login-page.tsx          # Pantalla de login
      home-page.tsx           # Home por rol
      qr-page.tsx             # QR dinámico personal
      credential-page.tsx     # Credencial virtual
      scan-access-page.tsx    # Escaneo de QR de acceso (todos)
      admin-scan-page.tsx     # Acceso manual (solo admin)
      reports-page.tsx        # Reportes (solo admin)
      scan-page.tsx           # Escaneo de QR de usuarios (admin/seguridad)
      auth-context.tsx        # Contexto de autenticación
    router.tsx
  assets/

cypress/
  e2e/
    login.cy.ts
    estudiante.cy.ts
    adminEmpleado.cy.ts
    scan-access.cy.ts

server/
  index.js                    # Backend Express
  .env                        # Variables de entorno (no incluido en git)
```

---

## Endpoints del backend

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/login` | Autenticación por ID o email |
| `GET` | `/access-logs` | Todos los registros de acceso |
| `GET` | `/access-logs/last?user_id=` | Último registro de un usuario |
| `POST` | `/access-logs` | Registrar nuevo acceso |
| `GET` | `/search?query=` | Buscar usuarios por nombre o ID |