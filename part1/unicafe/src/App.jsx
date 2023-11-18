import { useState } from "react"
import { PropTypes } from "prop-types"

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        {text === "positive" ? <td>{value} %</td> : <td>{value}</td>}
      </tr>
    </>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  return (
    <>
      {good + neutral + bad === 0 ? (
        <>
          <h1>Statistics</h1>
          <p>No feedback given</p>
        </>
      ) : (
        <>
          <h1>Statistics</h1>
          <table>
            <tbody>
              <StatisticLine text="good" value={good} />
              <StatisticLine text="neutral" value={neutral} />
              <StatisticLine text="bad" value={bad} />
              <StatisticLine text="all" value={good + neutral + bad} />
              <StatisticLine
                text="average"
                value={(good * 1 + bad * -1) / (good + neutral + bad)}
              />
              <StatisticLine
                text="positive"
                value={(good / (good + neutral + bad)) * 100}
              />
            </tbody>
          </table>
        </>
      )}
    </>
  )
}

const Button = ({ onClick, value, text }) => {
  const handleClick = () => onClick(value + 1)

  return <button onClick={() => handleClick(value)}>{text}</button>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = (value) => setGood(value)
  const handleNeutralClick = (value) => setNeutral(value)
  const handleBadClick = (value) => setBad(value)

  return (
    <>
      <h1>Give feedback</h1>
      <Button onClick={handleGoodClick} value={good} text="good" />
      <Button onClick={handleNeutralClick} value={neutral} text="neutral" />
      <Button onClick={handleBadClick} value={bad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App

Button.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.number,
  text: PropTypes.string
}

Statistics.propTypes = {
  good: PropTypes.number,
  neutral: PropTypes.number,
  bad: PropTypes.number
}

StatisticLine.propTypes = {
  text: PropTypes.string,
  value: PropTypes.number
}
