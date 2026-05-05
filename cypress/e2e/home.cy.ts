/// <reference types="cypress" />

const loginComo = (id: string, pass: string) => {
  cy.visit('/')
  cy.get('[data-cy="usuario"]').type(id)
  cy.get('[data-cy="password"]').type(pass)
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

describe('Home por Rol', () => {

  it('Estudiante ve su información correcta en Home', () => {
    loginComo('183112', 'password123')
    cy.contains('David Miguel Medina Raymundo').should('be.visible')
    cy.contains('Ingeniería en Sistemas Computacionales').should('be.visible')
    cy.contains('Semestre 5').should('be.visible')
    cy.contains('Académica').should('be.visible')
    cy.contains('Gaos').should('be.visible')
  })

  it('Estudiante no ve la sección de Administrador', () => {
    loginComo('183112', 'password123')
    cy.contains('Acceso Manual').should('not.exist')
    // Verifica que la sección especial de admin no existe
    cy.get('p').contains('Administrador').should('not.exist')
  })

  it('Empleado no ve el botón de Acceso Manual', () => {
    loginComo('2', 'password123')
    cy.contains('Acceso Manual').should('not.exist')
    cy.get('p').contains('Administrador').should('not.exist')
  })

})