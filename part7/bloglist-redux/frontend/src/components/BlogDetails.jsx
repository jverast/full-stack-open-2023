import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createComment } from '../reducers/blogReducer'

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
      <h2>comments</h2>
      <form onSubmit={handleCommentSubmit}>
        <input type="text" name="comment" />
        <button>add comment</button>
      </form>
      {!blog.comments.length ? (
        <p>
          <i>no comments yet</i>
        </p>
      ) : (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default BlogDetails
