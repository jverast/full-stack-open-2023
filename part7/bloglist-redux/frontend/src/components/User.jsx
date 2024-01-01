import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'

const User = ({ user }) => {
  if (!user) {
    return <p>loading...</p>
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          blogs added by <em>{user.name}</em>
        </Card.Title>
      </Card.Header>
      <ListGroup as="ol" numbered>
        {user.blogs.map((blog) => (
          <ListGroup.Item as="li" key={blog.id}>
            {blog.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}

export default User
