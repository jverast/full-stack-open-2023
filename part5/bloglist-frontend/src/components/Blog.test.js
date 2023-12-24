import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let blog, user
beforeEach(() => {
  blog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    user: {
      id: '657fb1d61d46105d45f42989',
      username: 'hellas',
      name: 'Arto Hellas'
    }
  }

  user = {
    id: '657fb1d61d46105d45f42989',
    username: 'hellas',
    name: 'Arto Hellas'
  }
})

test('renders blog if title and author are given', () => {
  const { container } = render(<Blog blog={blog} user={user} />)

  const titleEl = container.querySelector('.blog-title')
  const authorEl = container.querySelector('.blog-author')
  const detailsEl = container.querySelector('.blog-details')

  expect(titleEl).toBeDefined()
  expect(authorEl).toBeDefined()
  expect(detailsEl).toHaveStyle('display: none')
})

test('clicking the button displays the details: url and likes', async () => {
  const userSession = userEvent.setup()

  const { container } = render(<Blog blog={blog} user={user} />)
  const button = container.querySelector('.blog-view-btn')

  await userSession.click(button)
  expect(container.querySelector('.blog-details')).not.toHaveStyle(
    'display: none'
  )
})
