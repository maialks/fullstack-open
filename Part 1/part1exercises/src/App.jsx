const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course = {course}/>
      <Content course = {course} />
      <Total course = {course}/>
    </div>
  )
}

// Refactor the code so that it consists of three new components: Header, Content, and Total

const Header = (props) =>{
  return (
  <>
    <h1>{props.course.name}</h1>
  </>
  )
}

const Content = (props) => {
  const parts = props.course.parts
  return (
    <>
      <Part part={parts[0].name} exercise={parts[0].exercises}/>
      <Part part={parts[1].name} exercise={parts[1].exercises}/>
      <Part part={parts[2].name} exercise={parts[2].exercises}/>
    </>
  )
}

const Part = (props) =>{
  return (
    <p>{props.part} {props.exercise}</p>
  )
}

const Total = (props) =>{
  const parts = props.course.parts
  return (
  <p>
    Number of exercises {parts[0].exercises + 
    parts[1].exercises + parts[2].exercises}
  </p>
  )
}

export default App