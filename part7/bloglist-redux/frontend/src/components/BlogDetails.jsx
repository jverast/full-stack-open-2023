import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const BlogDetails = ({ updateBlog, removeBlog }) => {
  const id = useParams().id,
    blogs = useSelector((state) => state.blogs),
    userSession = useSelector((state) => state.userSession),
    blog = blogs.find((blog) => blog.id === id)

  if (!blog) {
    return <p>loading...</p>
  }

  const handleLikeClick = () => updateBlog(blog)
  const handleRemoveClick = () => removeBlog(blog)

  return (
    <>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes{' '}
        <button onClick={handleLikeClick} className="blog-like-btn">
          like
        </button>
      </div>
      {blog.user.id === userSession.id ? (
        <button onClick={handleRemoveClick} className="blog-remove-btn">
          remove
        </button>
      ) : (
        <div>Added by {blog.user.name}</div>
      )}
    </>
  )
}

export default BlogDetails
