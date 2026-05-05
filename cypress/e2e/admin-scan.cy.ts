/// <reference types="cypress" />

const loginAdmin = () => {
  cy.visit('/')
  cy.get('[data-cy="usuario"]').type('1')
  cy.get('[data-cy="password"]').type('password123')
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

const QR_DAVID = JSON.stringify({
  id: '183112',
  name: 'David Miguel Medina Raymundo',
  role: 'estudiante',
  token: 'abc123',
  timestamp: 'abc123'
})

const QR_INVALIDO = JSON.stringify({ location: 'Gaos', access: 'udlap' })

const simularQRAdmin = (qrText: string) => {
  cy.window().then((win) => { (win as any).__cypressQRAdmin = qrText })
  cy.get('[data-cy="simular-qr-admin"]').click({ force: true })
}

describe('Acceso Manual (Administrador)', () => {

  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:3000/access-logs', {
      statusCode: 200,
      body: { success: true, id: 99 }
    }).as('postLog')

    loginAdmin()
    cy.contains('Acceso Manual').click()
    cy.url().should('include', '/admin-scan')
  })

  it('Admin registra acceso manual correctamente', () => {
    simularQRAdmin(QR_DAVID)

    // Verifica que se detectó el usuario
    cy.get('[data-cy="usuario-escaneado"]', { timeout: 6000 }).should('be.visible')
    cy.contains('David Miguel Medina Raymundo').should('be.visible')

    // Selecciona Entrada y ubicación Proveedores
    cy.get('[data-cy="tipo-entrada"]').click()
    cy.get('[data-cy="ubicacion-proveedores"]').click()
    cy.get('[data-cy="confirmar-acceso"]').click()

    // Verifica resultado
    cy.get('[data-cy="resultado-exito-admin"]', { timeout: 6000 }).should('be.visible')
    cy.contains('Entrada Registrada').should('be.visible')
    cy.contains('David Miguel Medina Raymundo').should('be.visible')
    cy.contains('Proveedores').should('be.visible')

    cy.wait('@postLog').its('request.body').should('deep.include', {
      user_id: '183112',
      type: 'entrada',
      location: 'Proveedores',
    })
  })

  it('QR de acceso físico no es válido en Acceso Manual', () => {
    simularQRAdmin(QR_INVALIDO)
    cy.get('[data-cy="resultado-error-admin"]', { timeout: 6000 }).should('be.visible')
    cy.get('[data-cy="error-msg-admin"]')
      .should('contain', 'QR no válido')
  })

})