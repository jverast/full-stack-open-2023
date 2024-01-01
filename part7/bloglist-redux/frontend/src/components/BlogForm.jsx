import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="d-flex flex-column gap-1 mb-1 mx-auto"
      style={{ maxWidth: 600 }}
    >
      <Form.Group>
        <Form.Label visuallyHidden>title</Form.Label>
        <Form.Control
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="E.g. Considered Harmful"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label visuallyHidden>author</Form.Label>
        <Form.Control
          id="author"
          type="text"
          name="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="E.g. Edsger W. Dijk"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label visuallyHidden>url</Form.Label>
        <Form.Control
          id="url"
          type="text"
          name="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="E.g. https://example.com"
        />
      </Form.Group>
      <Form.Group className="text-center">
        <Button id="submit-button" type="submit" size={'sm'} className="px-5">
          create
        </Button>
      </Form.Group>
    </Form>
  )
}

export default BlogForm
