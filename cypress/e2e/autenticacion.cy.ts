/// <reference types="cypress" />

describe('Autenticación', () => {

  // TC-01
  it('Login exitoso con credenciales válidas', () => {
    cy.visit('/')
    cy.get('[data-cy="usuario"]').type('183112')
    cy.get('[data-cy="password"]').type('password123')
    cy.get('[data-cy="submit"]').click()
    cy.url().should('include', '/home')
    cy.contains('David Miguel Medina Raymundo').should('be.visible')
  })

  // TC-02
  it('Login rechaza contraseña incorrecta', () => {
    cy.visit('/')
    cy.get('[data-cy="usuario"]').type('183112')
    cy.get('[data-cy="password"]').type('WrongPass!')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="error-msg"]')
      .should('be.visible')
      .and('contain', 'ID o contraseña incorrectos')
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  // TC-03
  it('Login rechaza usuario inexistente', () => {
    cy.visit('/')
    cy.get('[data-cy="usuario"]').type('999999')
    cy.get('[data-cy="password"]').type('password123')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="error-msg"]')
      .should('be.visible')
      .and('contain', 'ID o contraseña incorrectos')
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

})