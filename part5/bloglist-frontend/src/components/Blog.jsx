import { useState } from 'react'

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const styles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikeClick = () => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateBlog(updatedBlog, blog.id)
  }

  const handleRemoveClick = () => removeBlog(blog.id)
  const userId = blog.user.id ?? blog.user

  return (
    <div style={styles}>
      <div>
        {blog.title}{' '}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={{ display: showDetails ? '' : 'none' }}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={handleLikeClick}>like</button>
        </div>
        <div>{blog.author}</div>
        {userId === user.id && (
          <button onClick={handleRemoveClick}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog
