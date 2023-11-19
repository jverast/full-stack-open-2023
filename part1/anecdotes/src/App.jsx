import { useState } from "react"
import PropTypes from "prop-types"

const Title = ({ title }) => <h1>{title}</h1>
const Anecdote = ({ anecdote }) => <div>{anecdote}</div>
const Votes = ({ votes }) => <div>has {votes} votes</div>

const Button = ({ onClick, text }) => {
  const handleClick = () => onClick()
  return <button onClick={handleClick}>{text}</button>
}

const App = () => {
  const anecdotes = [
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well."
  ]

  const [votes, setVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0
  })

  const [selected, setSelected] = useState(0)

  const handleNextAnecdoteClick = () => {
    const length = anecdotes.length,
      random = Math.floor(Math.random() * length)
    // to avoid repetitions
    random !== selected ? setSelected(random) : handleNextAnecdoteClick()
  }

  const handleVoteClick = (selected) => {
    setVotes({
      ...votes,
      [selected]: votes[selected] + 1
    })
  }

  const findMostVotesAnecdoteIndex = () => {
    const votesToArray = Object.values(votes),
      mostVotedIndex = votesToArray.indexOf(Math.max(...votesToArray))
    return mostVotedIndex
  }

  return (
    <>
      <Title title="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} />
      <Votes votes={votes[selected]} />
      <Button onClick={() => handleVoteClick(selected)} text="vote" />
      <Button onClick={handleNextAnecdoteClick} text="next anecdote" />
      <Title title="Anecdote with most votes" />
      <Anecdote anecdote={anecdotes[findMostVotesAnecdoteIndex()]} />
      <Votes votes={votes[findMostVotesAnecdoteIndex()]} />
    </>
  )
}

export default App

// Typechecking with PropTypes

Title.propTypes = {
  title: PropTypes.string
}

Anecdote.propTypes = {
  anecdote: PropTypes.string
}

Votes.propTypes = {
  votes: PropTypes.number
}

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string
}
