/// <reference types="cypress" />

const loginComo = (id: string, pass: string) => {
  cy.visit('/login')
  cy.get('[data-cy="usuario"]').type(id)
  cy.get('[data-cy="password"]').type(pass)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

const QR_GAOS     = JSON.stringify({ location: 'Gaos',        access: 'udlap' })
const QR_RECTA    = JSON.stringify({ location: 'Recta',       access: 'udlap' })
const QR_INVALIDO = JSON.stringify({ location: 'Desconocido', access: 'otro'  })
const QR_MAL_JSON = 'esto-no-es-json'

// Inyecta el QR en window y dispara el botón oculto
const simularQR = (qrText: string) => {
  cy.window().then((win) => {
    (win as any).__cypressQR = qrText
  })
  cy.get('[data-cy="simular-qr"]').click({ force: true })  // ← force: true
}

describe('Escanear Acceso (/scan-access)', () => {

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/access-logs/last*', {
      statusCode: 200,
      body: { last: null },
    }).as('getLastLog')

    cy.intercept('POST', 'http://localhost:3000/access-logs', {
      statusCode: 200,
      body: { success: true, id: 99 },
    }).as('postLog')

    loginComo('183112', 'password123')
    cy.contains('Escanear Acceso').click()
    cy.url().should('include', '/scan-access')
  })

  // ─── UI inicial ────────────────────────────────────────────────────────────
  describe('UI inicial', () => {

    it('muestra el título Escanear Acceso', () => {
      cy.contains('Escanear Acceso').should('be.visible')
    })

    it('muestra el botón Abrir Cámara', () => {
      cy.get('[data-cy="abrir-camara"]').should('be.visible')
    })

    it('no muestra resultado ni error al entrar', () => {
      cy.get('[data-cy="resultado-exito"]').should('not.exist')
      cy.get('[data-cy="resultado-error"]').should('not.exist')
    })

    it('el botón regresar lleva al home', () => {
      cy.get('button').first().click()
      cy.url().should('include', '/home')
    })

  })

  // ─── Primera entrada ───────────────────────────────────────────────────────
  describe('Primera entrada (sin registros previos)', () => {

    it('muestra Entrada Registrada', () => {
      simularQR(QR_GAOS)
      cy.get('[data-cy="resultado-exito"]', { timeout: 6000 }).should('be.visible')
      cy.contains('Entrada Registrada').should('be.visible')
    })

    it('muestra la ubicación Gaos', () => {
      simularQR(QR_GAOS)
      cy.get('[data-cy="resultado-exito"]', { timeout: 6000 })
      cy.contains('Gaos').should('be.visible')
    })

    it('muestra el nombre del usuario', () => {
      simularQR(QR_GAOS)
      cy.get('[data-cy="resultado-exito"]', { timeout: 6000 })
      cy.contains('David Miguel Medina Raymundo').should('be.visible')
    })

    it('llama al backend con type entrada', () => {
      simularQR(QR_GAOS)
      cy.wait('@postLog').its('request.body').should('deep.include', {
        type: 'entrada',
        method: 'QR',
        location: 'Gaos',
      })
    })

  })

  // ─── Salida ────────────────────────────────────────────────────────────────
  describe('Salida (último registro fue entrada)', () => {

    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:3000/access-logs/last*', {
        body: { last: 'entrada' },
      }).as('getLastLogEntrada')
    })

    it('muestra Salida Registrada', () => {
      simularQR(QR_RECTA)
      cy.get('[data-cy="resultado-exito"]', { timeout: 6000 }).should('be.visible')
      cy.contains('Salida Registrada').should('be.visible')
    })

    it('muestra la ubicación Recta', () => {
      simularQR(QR_RECTA)
      cy.get('[data-cy="resultado-exito"]', { timeout: 6000 })
      cy.contains('Recta').should('be.visible')
    })

    it('llama al backend con type salida', () => {
      simularQR(QR_RECTA)
      cy.wait('@postLog').its('request.body').should('deep.include', {
        type: 'salida',
        method: 'QR',
        location: 'Recta',
      })
    })

  })

  // ─── Alternancia entrada/salida ────────────────────────────────────────────
  describe('Alternancia entrada/salida', () => {

    it('registra salida si el último fue entrada', () => {
      cy.intercept('GET', 'http://localhost:3000/access-logs/last*', {
        body: { last: 'entrada' },
      })
      simularQR(QR_GAOS)
      cy.wait('@postLog').its('request.body')
        .should('deep.include', { type: 'salida' })
    })

    it('registra entrada si el último fue salida', () => {
      cy.intercept('GET', 'http://localhost:3000/access-logs/last*', {
        body: { last: 'salida' },
      })
      simularQR(QR_GAOS)
      cy.wait('@postLog').its('request.body')
        .should('deep.include', { type: 'entrada' })
    })

  })

  // ─── QR inválido ────────────────────────────────────────────────────────────
  describe('QR inválido', () => {

    it('muestra error si el QR no es de UDLAP', () => {
      simularQR(QR_INVALIDO)
      cy.get('[data-cy="resultado-error"]', { timeout: 6000 }).should('be.visible')
      cy.get('[data-cy="error-msg-scan"]').should('contain', 'QR no válido')
    })

    it('muestra error si el QR no es JSON válido', () => {
      simularQR(QR_MAL_JSON)
      cy.get('[data-cy="resultado-error"]', { timeout: 6000 }).should('be.visible')
      cy.get('[data-cy="error-msg-scan"]').should('contain', 'Error al procesar')
    })

    it('el botón Intentar de Nuevo regresa al estado inicial', () => {
      simularQR(QR_INVALIDO)
      cy.get('[data-cy="reintentar"]', { timeout: 6000 }).click()
      cy.get('[data-cy="abrir-camara"]').should('be.visible')
    })

  })

  // ─── Error del backend ──────────────────────────────────────────────────────
  describe('Error del backend', () => {

    it('muestra error si el POST falla', () => {
      cy.intercept('POST', 'http://localhost:3000/access-logs', {
        statusCode: 500,
        body: { error: 'Error interno' },
      })
      simularQR(QR_GAOS)
      cy.get('[data-cy="resultado-error"]', { timeout: 6000 }).should('be.visible')
      cy.get('[data-cy="error-msg-scan"]').should('contain', 'Error al procesar')
    })

  })

  // ─── Todos los roles pueden escanear ───────────────────────────────────────
  describe('Acceso para todos los roles', () => {

    const usuarios = [
      { id: '183112',   pass: 'password123', nombre: 'David Miguel Medina Raymundo' },
      { id: '2',    pass: 'password123', nombre: 'Carlos Ruiz Pérez' },
      { id: '1',      pass: 'password123', nombre: 'Anellisse Herrera Maldonado' },
    ]

    usuarios.forEach((u) => {
      it(`${u.nombre} ve el botón Escanear Acceso en home`, () => {
        loginComo(u.id, u.pass)
        cy.contains('Escanear Acceso').should('be.visible')
      })

      it(`${u.nombre} puede navegar a /scan-access`, () => {
        loginComo(u.id, u.pass)
        cy.contains('Escanear Acceso').click()
        cy.url().should('include', '/scan-access')
        cy.get('[data-cy="abrir-camara"]').should('be.visible')
      })

      it(`${u.nombre} puede simular un escaneo exitoso`, () => {
        loginComo(u.id, u.pass)
        cy.contains('Escanear Acceso').click()
        simularQR(QR_GAOS)
        cy.get('[data-cy="resultado-exito"]', { timeout: 6000 }).should('be.visible')
        cy.contains(u.nombre).should('be.visible')
      })
    })

  })

})