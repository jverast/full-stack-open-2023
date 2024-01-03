const AuthorPicker = ({ authors }) => {
  return (
    <div>
      select an author
      <select name="author">
        {authors.map((a) => (
          <option key={a.id} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default AuthorPicker
