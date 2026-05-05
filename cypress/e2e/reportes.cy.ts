/// <reference types="cypress" />

const loginAdmin = () => {
  cy.visit('/')
  cy.get('[data-cy="usuario"]').type('1')
  cy.get('[data-cy="password"]').type('password123')
  cy.get('[data-cy="submit"]').click()
  cy.url().should('include', '/home')
}

describe('Reportes', () => {

  beforeEach(() => {
    loginAdmin()
    cy.contains('Reportes').click()
    cy.url().should('include', '/reports')
    cy.contains('Cargando registros...').should('not.exist', { timeout: 8000 })
  })

  // TC-17
  it('Admin ve tabla con registros reales y gráficas', () => {
    // Tabla con encabezados
    cy.contains('Nombre').should('be.visible')
    cy.contains('Tipo').should('be.visible')
    cy.contains('Metodo').should('be.visible')
    cy.contains('Ubicacion').should('be.visible')

    // Datos reales de la BD
    cy.contains('Gaos').should('be.visible')
    cy.contains('Recta').should('be.visible')
    cy.contains('Periferico').should('be.visible')
    cy.contains('Proveedores').should('be.visible')
    cy.contains('QR').should('be.visible')
    cy.contains('Credencial').should('be.visible')

    // Gráficas
    cy.get('.recharts-bar').should('exist')
    cy.get('.recharts-pie').should('exist')
  })

  // TC-18
  it('Filtro por fecha sin resultados muestra tabla vacía', () => {
    cy.get('[data-cy="toggle-filters"]').click()
    cy.get('input[type="date"]').type('2020-01-01')

    // Total debe ser 0
    cy.contains('Total').should('be.visible')
    cy.contains('Registros (0)').should('be.visible')
  })

  // TC-19
  it('Estudiante no puede ver la página de Reportes', () => {
    // Login como estudiante
    cy.visit('/')
    cy.get('[data-cy="usuario"]').type('183112')
    cy.get('[data-cy="password"]').type('password123')
    cy.get('[data-cy="submit"]').click()
    cy.url().should('include', '/home')

    // No existe el botón de Reportes
    cy.contains('Reportes').should('not.exist')

    // Navegar directo a /reports no muestra datos
    cy.visit('/reports')
    cy.contains('Cargando registros...').should('not.exist')
    cy.get('table').should('not.exist')
  })

})