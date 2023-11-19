import PropTypes from "prop-types"

const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </>
  )
}

const Total = ({ parts }) => {
  return (
    <p>
      <b>
        total of {parts.reduce((sum, part) => sum + part.exercises, 0)}{" "}
        exercises
      </b>
    </p>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course

Course.propTypes = {
  course: PropTypes.object
}

Header.propTypes = {
  name: PropTypes.string
}

Total.propTypes = {
  parts: PropTypes.array
}

Content.propTypes = {
  parts: PropTypes.array
}

Part.propTypes = {
  part: PropTypes.object
}
