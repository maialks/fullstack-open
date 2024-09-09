// First letter of React component names must be capitalized.
// Another strong convention is the idea of a root component called App at the top of the component tree of the application.
const App = () => {
  // console.log(`Hello from component`)
  const name = "Lucas"
  const lastName = "Maia"
  const tais = {name: "Tais", birthYear: 2006}
  const cousins = ["Deb", "Enzo"] 
  // In React, the individual things rendered in braces must be primitive values, such as numbers or strings
  const now = new Date()
  // console.log(now)
  return (
    <div>
      <h1>Frist React App</h1>
      <p>Hello world</p>
      <Hello name= {tais.name} birthYear = {tais.birthYear}/>
      <Hello name= 'Lucas' birthYear = {2003}/>
      <Hello name = {cousins}/>
      {/* Any JavaScript code within the curly braces is evaluated and the result of this 
      evaluation is embedded into the defined place in the HTML produced by the component. */}
      <p>Code by {name} {lastName}</p>
      <p> {7} plus {14} is {1+14}</p>
    </div>
  )
}

// We have defined a new component Hello and used it inside the component App. 
// Naturally, a component can be used multiple times
const Hello = (props)=>{
  console.log(props)
  return (
    <>
      <p>Hello {props.name} 😉</p>
      <p>You are { 2024- props.birthYear } years old</p>
    </>
  )
}

export default App