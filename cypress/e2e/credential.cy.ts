/// <reference types="cypress" />

const loginComo = (id: string, pass: string) => {
  cy.visit('/')
  cy.get('[data-cy="usuario"]').type(id)
  cy.get('[data-cy="password"]').type(pass)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

describe('Credencial Virtual', () => {

  // TC-07
  it('Credencial muestra datos correctos del usuario y QR', () => {
    loginComo('183112', 'password123')
    cy.contains('Credencial Virtual').click()
    cy.url().should('include', '/credential')
    cy.contains('David Miguel Medina Raymundo').should('be.visible')
    cy.contains('183112').should('be.visible')
    cy.contains('Estudiante').should('be.visible')
    cy.contains('Activo').should('be.visible')
    cy.get('svg').should('be.visible')
  })

  // TC-08
  it('Credencial de estudiante no muestra campos de empleado', () => {
    loginComo('183604', 'password123')
    cy.contains('Credencial Virtual').click()
    cy.url().should('include', '/credential')
    // El chip de "Área" no debe existir para un estudiante
    cy.contains('Área').should('not.exist')
  })

  // TC-09
  it('Usuario sin sesión no puede acceder a /credential', () => {
    // Sin login, navegamos directo a /credential
    cy.visit('/credential')
    // El componente retorna null si no hay user, por lo que no hay contenido
    cy.contains('David').should('not.exist')
    cy.contains('Credencial Virtual').should('not.exist')
  })

})