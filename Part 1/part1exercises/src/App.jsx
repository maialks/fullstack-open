import { useState } from 'react'

const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min+1)) + min

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})

  const nextAnecdote = () => function(){
    setSelected((getRandomNum(0, anecdotes.length -1)))
  }

  const registerVote = () => function() {
    console.log(selected)
    setVotes({
      ...votes,
      [selected]: votes[selected] ? votes[selected] + 1 : 1 
    });
  };

  const getMostVoted = () => {
    if (!Object.keys(votes)[0]) return false
    const [key, value] = Object.entries(votes).reduce((acc, cur) => cur[1] > acc[1] ? cur : acc)
    return [key, value]
  } 


  return (
    <div>
      <Display title={"Anecdotes of the day"} body ={anecdotes[selected]}/>
      <p>has {votes[selected] ? votes[selected] : "no" } votes</p>
      <Button text ={"next anecdote"} onClick={nextAnecdote()}/>
      <Button text ={"vote"} onClick={registerVote()}/>
      <Display title={"Anecdote with most votes"} body ={getMostVoted()? `${anecdotes[getMostVoted()[0]]}
      has ${votes[getMostVoted()[0]]} votes` : "no anecdote was voted yet"}/>
    </div>
  )
}

const Display = (props) => <> <h2>{props.title}</h2><h3>{props.body}</h3></>

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>
export default App