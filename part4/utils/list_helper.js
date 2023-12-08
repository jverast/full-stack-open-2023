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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
