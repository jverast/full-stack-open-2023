import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ updateBlog, removeBlog, user, blog }) => {
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

  const handleShowDetails = () => setShowDetails(!showDetails)
  const handleRemoveClick = () => removeBlog(blog.id)
  const userId = blog.user.id ?? blog.user

  return (
    <div className="blog" style={styles}>
      <div>
        <div className="blog-title">
          {blog.title}
          <button onClick={handleShowDetails} className="blog-view-btn">
            {showDetails ? 'hide' : 'view'}
          </button>
        </div>
        <div className="blog-author">{blog.author}</div>
      </div>
      <div
        style={{ display: showDetails ? '' : 'none' }}
        className="blog-details"
      >
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <button onClick={handleLikeClick} className="blog-like-btn">
            like
          </button>
        </div>
        {userId === user.id && (
          <button onClick={handleRemoveClick} className="blog-remove-btn">
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog

Blog.propTypes = {
  updateBlog: PropTypes.func,
  removeBlog: PropTypes.func,
  blog: PropTypes.object,
  user: PropTypes.object
}
