import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders blog if title and author are given', () => {
  const blog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    user: {
      id: '657fb1d61d46105d45f42989',
      username: 'hellas',
      name: 'Arto Hellas'
    }
  }

  const user = {
    id: '657fb1d61d46105d45f42989',
    username: 'hellas',
    name: 'Arto Hellas'
  }

  const { container } = render(<Blog blog={blog} user={user} />)

  const titleEl = container.querySelector('.blog-title')
  const authorEl = container.querySelector('.blog-author')
  const detailsEl = container.querySelector('.blog-details')

  expect(titleEl).toBeDefined()
  expect(authorEl).toBeDefined()
  expect(detailsEl).toHaveStyle('display: none')
})
