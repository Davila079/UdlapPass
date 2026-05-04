/// <reference types="cypress" />

// ─── CREDENCIALES ─────────────────────────────────────────────────────────────
const ADMIN   = { id: '1', pass: 'password123', nombre: 'Anellisse Herrera Maldonado', area: 'Dirección' }
const EMPLEADO = { id: '2', pass: 'password123', nombre: 'Carlos Ruiz Pérez', area: 'Servicios Escolares' }

// ─── HELPER ───────────────────────────────────────────────────────────────────
const loginComo = (id: string, pass: string) => {
  cy.visit('/login')
  cy.get('[data-cy="usuario"]').type(id)
  cy.get('[data-cy="password"]').type(pass)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

// ══════════════════════════════════════════════════════════════════════════════
// EMPLEADO
// ══════════════════════════════════════════════════════════════════════════════
describe('Empleado', () => {

  beforeEach(() => loginComo(EMPLEADO.id, EMPLEADO.pass))

  // ─── Home ──────────────────────────────────────────────────────────────────
  describe('Home', () => {

    it('muestra el nombre completo del empleado', () => {
      cy.contains('Carlos Ruiz Pérez').should('be.visible')
    })

    it('muestra el rol como Empleado', () => {
      cy.contains('Empleado').should('be.visible')
    })

    it('muestra el área del empleado', () => {
      cy.contains('Servicios Escolares').should('be.visible')
    })

    it('muestra foto de perfil', () => {
      cy.get('img').first()
        .should('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty')
    })

    it('muestra botones de Codigo QR y Credencial Virtual', () => {
      cy.contains('Codigo QR').should('be.visible')
      cy.contains('Credencial Virtual').should('be.visible')
    })

    it('NO muestra sección de Administrador', () => {
      cy.contains('Administrador').should('not.exist')
    })

    it('NO muestra sección de Reportes', () => {
      cy.contains('Reportes').should('not.exist')
    })

  })

  // ─── Credencial ────────────────────────────────────────────────────────────
  describe('Credencial Digital', () => {

    beforeEach(() => {
      cy.contains('Credencial Virtual').click()
      cy.url().should('include', '/credential')
    })

    it('muestra el nombre en la credencial', () => {
      cy.contains('Carlos Ruiz Pérez').should('be.visible')
    })

    it('muestra el rol Empleado en la credencial', () => {
      cy.contains('Empleado').should('be.visible')
    })

    it('muestra el área en la credencial', () => {
      cy.contains('Servicios Escolares').should('be.visible')
    })

    it('muestra estado Activo', () => {
      cy.contains('Activo').should('be.visible')
    })

    it('muestra el QR con datos del usuario', () => {
      cy.get('svg').should('be.visible')
      cy.contains('Carlos Ruiz Pérez').should('be.visible')
    })

    it('muestra foto en la credencial', () => {
      cy.get('img')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty')
    })

    it('el botón regresar lleva al home', () => {
      cy.get('button').first().click()
      cy.url().should('include', '/home')
    })

  })

  // ─── QR Dinámico ───────────────────────────────────────────────────────────
  describe('QR Dinámico', () => {

    beforeEach(() => {
      cy.contains('Codigo QR').click()
      cy.url().should('include', '/qr')
    })

    it('muestra el QR dinámico', () => {
      cy.get('svg').should('be.visible')
    })

    it('muestra el nombre bajo el QR', () => {
      cy.contains('Carlos Ruiz Pérez').should('be.visible')
    })

    it('muestra el contador en 30 al entrar', () => {
      cy.contains('30').should('be.visible')
    })

    it('el contador va bajando', () => {
      cy.wait(3000)
      cy.get('span').filter(':contains("30")').should('not.exist')
    })

    it('el QR cambia al presionar regenerar', () => {
      cy.get('[data-cy="qr-code"] svg').invoke('html').then((qrInicial) => {
        cy.get('button').last().click()
        cy.get('[data-cy="qr-code"] svg').invoke('html').should('not.equal', qrInicial)
      })
    })

    it('el contador vuelve a 30 al regenerar', () => {
      cy.wait(3000)
      cy.get('button').last().click()
      cy.contains('30').should('be.visible')
    })

    it('el botón regresar lleva al home', () => {
      cy.get('button').first().click()
      cy.url().should('include', '/home')
    })

  })

})

// ══════════════════════════════════════════════════════════════════════════════
// ADMINISTRADOR
// ══════════════════════════════════════════════════════════════════════════════
describe('Administrador', () => {

  beforeEach(() => loginComo(ADMIN.id, ADMIN.pass))

  // ─── Home ──────────────────────────────────────────────────────────────────
  describe('Home', () => {

    it('muestra el nombre completo del administrador', () => {
      cy.contains('Anellisse Herrera Maldonado').should('be.visible')
    })

    it('muestra el rol como Administrador', () => {
      cy.contains('Administrador').should('be.visible')
    })

    it('muestra el área Dirección', () => {
      cy.contains('Dirección').should('be.visible')
    })

    it('muestra botones de Codigo QR, Credencial Virtual y Escanear', () => {
      cy.contains('Codigo QR').should('be.visible')
      cy.contains('Credencial Virtual').should('be.visible')
      cy.contains('Escanear').should('be.visible')
    })

    it('muestra sección de Administrador con Reportes e Identificar', () => {
      cy.contains('Reportes').should('be.visible')
      cy.contains('Identificar').should('be.visible')
    })

    it('NO muestra sección de Seguridad', () => {
      cy.contains('Seguridad').should('not.exist')
    })

  })

  // ─── Credencial ────────────────────────────────────────────────────────────
  describe('Credencial Digital', () => {

    beforeEach(() => {
      cy.contains('Credencial Virtual').click()
      cy.url().should('include', '/credential')
    })

    it('muestra el nombre en la credencial', () => {
      cy.contains('Anellisse Herrera Maldonado').should('be.visible')
    })

    it('muestra el rol Administrador en la credencial', () => {
      cy.contains('Administrador').should('be.visible')
    })

    it('muestra el área Dirección en la credencial', () => {
      cy.contains('Dirección').should('be.visible')
    })

    it('muestra estado Activo', () => {
      cy.contains('Activo').should('be.visible')
    })

    it('muestra el QR con datos del usuario', () => {
      cy.get('svg').should('be.visible')
      cy.contains('Anellisse Herrera Maldonado').should('be.visible')
    })

    it('el botón regresar lleva al home', () => {
      cy.get('button').first().click()
      cy.url().should('include', '/home')
    })

  })

  // ─── Reportes ──────────────────────────────────────────────────────────────
  describe('Reportes', () => {

    beforeEach(() => {
      cy.contains('Reportes').click()
      cy.url().should('include', '/reports')
      cy.contains('Cargando registros...').should('not.exist', { timeout: 8000 })
    })

    it('muestra las 3 métricas: Total, Entradas y Salidas', () => {
      cy.contains('Total').should('be.visible')
      cy.contains('Entradas').should('be.visible')
      cy.contains('Salidas').should('be.visible')
    })

    it('el total de registros es mayor a 0', () => {
      cy.contains('Total').parent().find('.text-\\[\\#ec5b13\\]').invoke('text').then((txt) => {
        expect(parseInt(txt)).to.be.greaterThan(0)
      })
    })

    it('muestra encabezados de la tabla', () => {
      cy.contains('Nombre').should('be.visible')
      cy.contains('Tipo').should('be.visible')
      cy.contains('Metodo').should('be.visible')
      cy.contains('Ubicacion').should('be.visible')
      cy.contains('Hora').should('be.visible')
      cy.contains('Fecha').should('be.visible')
    })

    it('muestra ubicaciones reales de la BD', () => {
      cy.contains('Proveedores').should('be.visible')
      cy.contains('Recta').should('be.visible')
      cy.contains('Gaos').should('be.visible')
      cy.contains('Periferico').should('be.visible')
    })

    it('muestra métodos de acceso reales de la BD', () => {
      cy.contains('QR').should('be.visible')
      cy.contains('Credencial').should('be.visible')
      cy.contains('Vehicular').should('be.visible')
    })

    it('filtra por tipo Entrada: solo muestra entradas', () => {
      cy.get('[data-cy="toggle-filters"]').click()
      cy.get('select').eq(1).select('entrada')
      cy.get('.bg-green-500').should('exist')
      cy.get('.bg-red-400').should('not.exist')
    })

    it('filtra por tipo Salida: solo muestra salidas', () => {
      cy.get('[data-cy="toggle-filters"]').click()
      cy.get('select').eq(1).select('salida')
      cy.get('.bg-red-400').should('exist')
      cy.get('.bg-green-500').should('not.exist')
    })

    it('filtra por fecha 2026-04-15: solo muestra esa fecha', () => {
      cy.get('[data-cy="toggle-filters"]').click()
      cy.get('input[type="date"]').type('2026-04-15')
      cy.contains('2026-04-15').should('be.visible')
      cy.contains('2026-04-13').should('not.exist')
      cy.contains('2026-04-12').should('not.exist')
    })

    it('filtra por fecha 2026-04-12: muestra registros de Elisa', () => {
      cy.get('[data-cy="toggle-filters"]').click()
      cy.get('input[type="date"]').type('2026-04-12')
      cy.contains('2026-04-12').should('be.visible')
      cy.contains('2026-04-15').should('not.exist')
    })

    it('filtra por rol Estudiante: muestra registros de estudiantes', () => {
      cy.get('[data-cy="toggle-filters"]').click()
      cy.get('select').first().select('estudiante')
      cy.contains('David Miguel Medina Raymundo').should('be.visible')
    })

    it('filtra por rol Empleado: muestra registros de Carlos', () => {
      cy.get('[data-cy="toggle-filters"]').click()
      cy.get('select').first().select('empleado')
      cy.contains('Carlos Ruiz Pérez').should('be.visible')
      cy.contains('David Miguel Medina Raymundo').should('not.exist')
    })

    it('muestra gráfica de barras por día', () => {
      cy.get('.recharts-bar').should('exist')
    })

    it('muestra gráfica de pastel Entradas vs Salidas', () => {
      cy.get('.recharts-pie').should('exist')
    })

    it('el botón regresar lleva al home', () => {
      cy.get('button').first().click()
      cy.url().should('include', '/home')
    })

  })

})