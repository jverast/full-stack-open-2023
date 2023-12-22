import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const styles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

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
          likes {blog.likes} <button>like</button>
        </div>
        <div>{blog.author}</div>
      </div>
    </div>
  )
}

export default Blog
