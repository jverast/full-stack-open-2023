import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createComment } from '../reducers/blogReducer'
import { Button, Card, Form, ListGroup } from 'react-bootstrap'

const BlogDetails = ({ updateBlog, removeBlog }) => {
  const id = useParams().id,
    dispatch = useDispatch(),
    blogs = useSelector((state) => state.blogs),
    userSession = useSelector((state) => state.userSession),
    blog = blogs.find((blog) => blog.id === id)

  if (!blog) {
    return <p>loading...</p>
  }

  const handleLikeClick = () => updateBlog(blog)
  const handleRemoveClick = () => removeBlog(blog)

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''
    dispatch(createComment(blog.id, comment))
  }

  return (
    <>
      <section className="blog-detail mb-3">
        <Card className="text-center">
          <Card.Header className="text-start">
            <Card.Title>blog details</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Title>{blog.title}</Card.Title>
            <Card.Text>
              {blog.likes} likes{' '}
              <Button
                onClick={handleLikeClick}
                className="blog-like-btn"
                variant="outline-primary"
                size={'sm'}
              >
                like
              </Button>
            </Card.Text>
            <a href={blog.url} target="_blank" rel="noreferrer">
              <Button variant="primary">Go to post</Button>
            </a>
          </Card.Body>
          <Card.Footer className="text-muted">
            {blog.user.id === userSession.id ? (
              <Button
                onClick={handleRemoveClick}
                className="blog-remove-btn"
                variant="danger"
              >
                remove
              </Button>
            ) : (
              <div>
                Added by <em>{blog.user.name}</em>
              </div>
            )}
          </Card.Footer>
        </Card>
      </section>
      <section className="comments">
        <Card>
          <Card.Header>
            <Card.Title>comments</Card.Title>
          </Card.Header>
          <Form
            onSubmit={handleCommentSubmit}
            className="d-flex gap-3 mx-auto w-50 my-3"
          >
            <Form.Control
              type="text"
              name="comment"
              placeholder="leave a comment"
            />
            <Button>add</Button>
          </Form>
          {!blog.comments.length ? (
            <Card.Text>
              <em>no comments yet</em>
            </Card.Text>
          ) : (
            <ListGroup className="">
              {blog.comments.map((comment, index, arr) => (
                <ListGroup.Item
                  key={index}
                  style={{
                    borderTop:
                      index === 0 || index === arr.length - 1 ? '0' : ''
                  }}
                >
                  &quot;{comment}&quot;
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card>
      </section>
    </>
  )
}

export default BlogDetails
