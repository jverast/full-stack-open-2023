describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    })
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'salainen'
    })
    cy.visit('')
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

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('a blog can be created', function () {
      cy.contains('create new blog').click()

      cy.get('#title').type('React patterns')
      cy.get('#author').type('Michael Chan')
      cy.get('#url').type('https://reactpatterns.com/')

      cy.get('#submit-button').click()

      cy.get('.info')
        .should('contain', 'a new blog React patterns added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('.blog-title').should('contain', 'React patterns')
      cy.get('.blog-author').should('contain', 'Michael Chan')
    })

    describe('And a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/'
        })
      })

      it('only original creator can see the delete button of a blog', function () {
        cy.get('.logout').click()
        cy.login({ username: 'hellas', password: 'salainen' })

        cy.contains('React patterns').parent().parent().as('currentBlog')
        cy.get('@currentBlog').find('.blog-view-btn').click()
        cy.get('@currentBlog').find('.blog-remove-btn').should('not.exist')
      })
    })

    describe('And several blog exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
        })
        cy.createBlog({
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
        })
        cy.createBlog({
          title: 'TDD harms architecture',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
        })
      })

      it('users can like a blog', function () {
        cy.get('.blog-title:first').parent().parent().as('firstBlog')
        cy.get('@firstBlog').find('.blog-view-btn').click()
        cy.get('@firstBlog').find('.blog-like-btn').click()

        cy.get('@firstBlog').should('contain', 'likes 1')
      })
    })

    it('user who created a blog can delete it', function () {
      cy.createBlog({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      })

      cy.contains('Type wars').parent().parent().as('currentBlog')
      cy.get('@currentBlog').find('.blog-view-btn').click()
      cy.get('@currentBlog').find('.blog-remove-btn').click()

      cy.contains('Type wars').should('not.exist')
    })

    it.only('blogs should be sorted by number of likes', function () {
      cy.createBlog({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/'
      })

      cy.createBlog({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      })

      // "likes" in the first blog
      cy.get('.blog').eq(0).as('firstBlog')
      cy.get('@firstBlog').find('.blog-view-btn').click()
      const likeBtn1 = cy.get('@firstBlog').find('.blog-like-btn')

      Cypress._.times(3, () => {
        likeBtn1.click().wait(500)
      })

      // "likes" in the second blog
      cy.get('.blog').eq(1).as('lastBlog')
      cy.get('@lastBlog').find('.blog-view-btn').click()
      const likeBtn2 = cy.get('@lastBlog').find('.blog-like-btn')

      Cypress._.times(5, () => {
        likeBtn2.click().wait(500)
      })

      //tests
      cy.get('.blog').eq(0).should('contain', 'Type wars')
      cy.get('.blog').eq(1).should('contain', 'React patterns')
    })
  })
})
