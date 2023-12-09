const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return {}
  } else {
    const { title, author, likes } = blogs.reduce((max, blog) => {
      return max.likes < blog.likes ? blog : max
    }, blogs[0])

    return { title, author, likes }
  }
}

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return {}
  } else {
    return Object.values(
      blogs.reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] || []
        authors[blog.author].push({ author: blog.author })
        return authors
      }, {})
    )
      .map((item) => ({ author: item[0].author, blogs: item.length }))
      .sort((a, b) => b.blogs - a.blogs)[0]
  }
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return {}
  } else {
    return Object.values(
      blogs.reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] || []
        authors[blog.author].push(blog)
        return authors
      }, {})
    )
      .map((arr, index) =>
        arr.reduce(
          (acum, blog) => {
            acum = { ...acum, likes: acum.likes + blog.likes }
            return acum
          },
          { author: blogs[index].author, likes: 0 }
        )
      )
      .sort((a, b) => b.likes - a.likes)[0]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
