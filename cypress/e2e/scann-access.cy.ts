/// <reference types="cypress" />

const loginComo = (id: string, pass: string) => {
  cy.visit('/')
  cy.get('[data-cy="usuario"]').type(id)
  cy.get('[data-cy="password"]').type(pass)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

const QR_GAOS     = JSON.stringify({ location: 'Gaos', access: 'udlap' })
const QR_INVALIDO = JSON.stringify({ location: 'Desconocido', access: 'otro' })

const simularQR = (qrText: string) => {
  cy.window().then((win) => { (win as any).__cypressQR = qrText })
  cy.get('[data-cy="simular-qr"]').click({ force: true })
}

describe('Escanear Acceso', () => {

  beforeEach(() => {
    // El último registro fue salida → el siguiente debe ser entrada
    cy.intercept('GET', 'http://localhost:3000/access-logs/last*', {
      body: { last: 'salida' }
    }).as('getLastLog')

    cy.intercept('POST', 'http://localhost:3000/access-logs', {
      statusCode: 200,
      body: { success: true, id: 99 }
    }).as('postLog')

    loginComo('183112', 'password123')
    cy.contains('Escanear Acceso').click()
    cy.url().should('include', '/scan-access')
  })

  // TC-12
  it('QR válido de UDLAP registra acceso correctamente', () => {
    simularQR(QR_GAOS)
    cy.get('[data-cy="resultado-exito"]', { timeout: 6000 }).should('be.visible')
    cy.contains('Entrada Registrada').should('be.visible')
    cy.contains('Gaos').should('be.visible')
    cy.contains('David Miguel Medina Raymundo').should('be.visible')
    cy.wait('@postLog').its('request.body').should('deep.include', {
      type: 'entrada',
      method: 'QR',
      location: 'Gaos',
    })
  })

  // TC-13
  it('QR con formato inválido muestra error', () => {
    simularQR(QR_INVALIDO)
    cy.get('[data-cy="resultado-error"]', { timeout: 6000 }).should('be.visible')
    cy.get('[data-cy="error-msg-scan"]')
      .should('contain', 'QR no válido')
  })

  // TC-14
  it('Error del backend muestra mensaje de error', () => {
    cy.intercept('POST', 'http://localhost:3000/access-logs', {
      statusCode: 500,
      body: { error: 'Error interno' }
    }).as('postLogFail')

    simularQR(QR_GAOS)
    cy.get('[data-cy="resultado-error"]', { timeout: 6000 }).should('be.visible')
    cy.get('[data-cy="error-msg-scan"]')
      .should('contain', 'Error al procesar')
  })

})