describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('/login')
  })

  it('rechaza credenciales inválidas', () => {
    cy.get('[data-cy="usuario"]').type('999999')
    cy.get('[data-cy="password"]').type('WrongPass!')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="error-msg"]')
      .should('be.visible')
      .and('contain', 'ID o contraseña incorrectos')
  })

  it('permite acceso con credenciales válidas', () => {
    cy.get('[data-cy="usuario"]').type('183112')
    cy.get('[data-cy="password"]').type('password123')
    cy.get('[data-cy="submit"]').click()
    cy.url().should('include', '/home')
  })

  it('no muestra error al cargar la página', () => {
    cy.get('[data-cy="error-msg"]').should('not.exist')
  })

  it('no permite enviar con campos vacíos', () => {
  cy.get('[data-cy="submit"]').click()
  cy.get('[data-cy="error-msg"]')
    .should('be.visible')
    .and('contain', 'ID o contraseña incorrectos')
  })

})