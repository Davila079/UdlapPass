/// <reference types="cypress" />
describe('Funcionalidades de Estudiante', () => {

  // ─── DATOS REALES DE LA BASE DE DATOS ─────────────────────────────────────
  const estudiantes = [
    {
      id: '183112',
      nombre: 'David Miguel Medina Raymundo',
      carrera: 'Ingeniería en Sistemas Computacionales',
      semestre: '5',
      beca: 'Académica',
      residente: true,
      colegio: 'Gaos',
    },
    {
      id: '183604',
      nombre: 'Maria Fernanda Morales Hernandez',
      carrera: 'Ingeniería en Sistemas Computacionales',
      semestre: '4',
      beca: 'Académica',
      residente: false,
    },
    {
      id: '183913',
      nombre: 'Elisa Mendoza Cárdenas',
      carrera: 'Historia del Arte y Curaduría',
      semestre: '4',
      beca: 'Sin Beca',
      residente: false,
    },
  ]

  const PASS = 'password123'

  // ─── LOGIN HELPER ──────────────────────────────────────────────────────────
  const loginComo = (id: string) => {
    cy.visit('/login')
    cy.get('[data-cy="usuario"]').type(id)
    cy.get('[data-cy="password"]').type(PASS)
    cy.get('[data-cy="submit"]').click()
    cy.url().should('include', '/home')
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HOME — Info correcta por cada estudiante
  // ══════════════════════════════════════════════════════════════════════════
  describe('Home - Información del estudiante', () => {

    estudiantes.forEach((e) => {
      describe(`Estudiante: ${e.nombre}`, () => {

        beforeEach(() => loginComo(e.id))

        it('muestra el nombre completo', () => {
          cy.contains(e.nombre).should('be.visible')
        })

        it('muestra el ID', () => {
          cy.contains(e.id).should('be.visible')
        })

        it('muestra la carrera', () => {
          cy.contains(e.carrera).should('be.visible')
        })

        it('muestra el semestre', () => {
          cy.contains(`Semestre ${e.semestre}`).should('be.visible')
        })

        it('muestra la beca correcta', () => {
          cy.contains(e.beca).should('be.visible')
        })

        it(`muestra Residente: ${e.residente ? 'Si' : 'No'}`, () => {
          cy.contains(`Residente: ${e.residente ? 'Si' : 'No'}`).should('be.visible')
        })

        if (e.colegio) {
          it(`muestra el colegio ${e.colegio}`, () => {
            cy.contains(e.colegio!).should('be.visible')
          })
        }

        it('muestra rol como Estudiante', () => {
          cy.contains('Estudiante').should('be.visible')
        })

        it('muestra foto de perfil', () => {
          cy.get('img').first()
            .should('be.visible')
            .and('have.attr', 'src')
            .and('not.be.empty')
        })

        it('NO muestra sección de Administrador', () => {
          cy.contains('Administrador').should('not.exist')
        })

      })
    })

  })

  // ══════════════════════════════════════════════════════════════════════════
  // CREDENCIAL DIGITAL
  // ══════════════════════════════════════════════════════════════════════════
  describe('Credencial Digital', () => {

    estudiantes.forEach((e) => {
      describe(`Credencial de: ${e.nombre}`, () => {

        beforeEach(() => {
          loginComo(e.id)
          cy.contains('Credencial Virtual').click()
          cy.url().should('include', '/credential')
        })

        it('muestra el nombre en la credencial', () => {
          cy.contains(e.nombre).should('be.visible')
        })

        it('muestra el ID en la credencial', () => {
          cy.contains(e.id).should('be.visible')
        })

        it('muestra la carrera en la credencial', () => {
          cy.contains(e.carrera).should('be.visible')
        })

        it('muestra el semestre en la credencial', () => {
          cy.contains(String(e.semestre)).should('be.visible')
        })

        it('muestra la beca en la credencial', () => {
          cy.contains(e.beca).should('be.visible')
        })

        it('muestra estado Activo', () => {
          cy.contains('Activo').should('be.visible')
        })

        it('muestra el QR con datos del usuario', () => {
          cy.get('svg').should('be.visible')
          // El QR existe y el ID también está visible cerca
          cy.contains(e.id).should('be.visible')
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
    })

  })

  // ══════════════════════════════════════════════════════════════════════════
  // QR DINÁMICO
  // ══════════════════════════════════════════════════════════════════════════
  describe('QR Dinámico', () => {

    // Usamos solo el primer estudiante para estas pruebas de comportamiento
    const e = estudiantes[0]

    beforeEach(() => {
      loginComo(e.id)
      cy.contains('Codigo QR').click()
      cy.url().should('include', '/qr')
    })

    it('muestra el QR dinámico', () => {
      cy.get('[data-cy="qr-code"] svg').should('be.visible')
    })

    it('muestra el nombre bajo el QR', () => {
      cy.contains(e.nombre).should('be.visible')
    })

    it('muestra el ID bajo el QR', () => {
      cy.contains(e.id).should('be.visible')
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