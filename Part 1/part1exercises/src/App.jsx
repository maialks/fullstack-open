import { useState } from "react"

const App = ()=> {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => function(){
    console.log("good +1")
    setGood(good +1)
  }
  const handleNeutral = ()=> function(){
    console.log("neutral")
    setNeutral(neutral +1)
  }
  const handleBad = ()=> function() {
    setBad(bad +1)
    console.log("bad")
  }
  return (
    <div>
    <DisplayTitle text={"give feedback"}/>
    <Button text={"good"} onClick={handleGood()}/>
    <Button text={"neutral"} onClick={handleNeutral()}/>
    <Button text={"bad"} onClick={handleBad()}/>
    <DisplayTitle text={"statistics"}/>
    <DisplayText text={`good: ${good}`}/>
    <DisplayText text={`neutral: ${neutral}`}/>
    <DisplayText text={`bad: ${bad}`}/>
    </div>
  )
}

const DisplayTitle = (props) => <h1>{props.text}</h1>
const DisplayText = (props) => <h4>{props.text}</h4>
const Button = (props) => <button onClick={props.onClick}>{props.text}</button>



export default App