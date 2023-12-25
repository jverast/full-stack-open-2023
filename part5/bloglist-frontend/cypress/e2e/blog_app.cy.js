describe('blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    })
    cy.visit('http://localhost:5173')
  })

  it('login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.get('button').should('contain', 'login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen is logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('123456')
      cy.get('#login-button').click()

      cy.get('.info')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })
})
