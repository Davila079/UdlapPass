/// <reference types="cypress" />

const loginComo = (id: string, pass: string) => {
  cy.visit('/')
  cy.get('[data-cy="usuario"]').type(id)
  cy.get('[data-cy="password"]').type(pass)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

describe('QR Dinámico', () => {

  beforeEach(() => {
    loginComo('183112', 'password123')
    cy.contains('Codigo QR').click()
    cy.url().should('include', '/qr')
  })

  // TC-10
  it('QR se genera con datos del usuario y contador en 30', () => {
    cy.get('svg').should('be.visible')
    cy.contains('David Miguel Medina Raymundo').should('be.visible')
    cy.contains('30').should('be.visible')
  })

  // TC-11
  it('El QR cambia al presionar el botón de regenerar', () => {
    cy.get('[data-cy="qr-code"] svg').invoke('html').then((inicial) => {
      cy.get('button').last().click()
      cy.get('[data-cy="qr-code"] svg').invoke('html').should('not.equal', inicial)
    })
  })

})