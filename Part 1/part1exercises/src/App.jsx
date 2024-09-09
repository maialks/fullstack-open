const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const exercises = [exercises1, exercises2, exercises3]
  return (
    <div>
      <Header course = {course}/>
      <Content part1 = {part1} part2 = {part2} part3 = {part3} exercises = {exercises}/>
      <Total exercises = {exercises}/>
    </div>
  )
}

// Refactor the code so that it consists of three new components: Header, Content, and Total

const Header = (props) =>{
  return (
  <>
    <h1>{props.course}</h1>
  </>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <>
      <Part part={props.part1} exercise={props.exercises[0]}/>
      <Part part={props.part2} exercise={props.exercises[1]}/>
      <Part part={props.part3} exercise={props.exercises[2]}/>
    </>
  )
}

const Part = (props) =>{
  return (
    <p>{props.part} {props.exercise}</p>
  )
}

const Total = (props) =>{
  return (
    <>Number of exercises {props.exercises.reduce((acc, cur)=> acc + cur)}</>
  )
}

export default App