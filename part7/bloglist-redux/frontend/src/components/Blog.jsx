import PropTypes from 'prop-types'
import { Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <Card className="blog">
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Link
            to={`/blogs/${blog.id}`}
            className="link-underline link-underline-opacity-0"
          >
            {blog.title} {blog.author}
          </Link>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default Blog

Blog.propTypes = {
  blog: PropTypes.object
}
