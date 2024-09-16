import { useState } from "react"

const App = ()=> {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let all = good + bad+ neutral

  const handleGood = () => function(){
    console.log("good +1")
    setGood(good +1)
    all++
  }
  const handleNeutral = ()=> function(){
    console.log("neutral")
    setNeutral(neutral +1)
    all++
  }
  const handleBad = ()=> function() {
    console.log("bad")
    setBad(bad +1)
    all++
  }
  return (
    <div>
    <DisplayTitle text={"give feedback"}/>
    <Button text={"good"} onClick={handleGood()}/>
    <Button text={"neutral"} onClick={handleNeutral()}/>
    <Button text={"bad"} onClick={handleBad()}/>
    <DisplayTitle text={"statistics"}/>
    <Statistics values={{good, neutral, bad, all}}/>
    </div>
  )
}

const DisplayTitle = (props) => <h1>{props.text}</h1>
const DisplayText = (props) => <p>{props.text}</p>
const Button = (props) => <button onClick={props.onClick}>{props.text}</button>
const Statistics = (props) =>{
  const {good, neutral, bad, all} = props.values
  const calclAvg = () =>( good - bad) / all
  if (!all) return (<p>No feedback given</p>)
  return (
    <>
    <StatisticLine text={`good:`} value={good}/>
    <StatisticLine text={`neutral:`} value={neutral}/>
    <StatisticLine text={`bad:`} value={bad}/>
    <StatisticLine text={`all:`} value={all}/>
    <StatisticLine text={`average:`} value={calclAvg()}/>
    <StatisticLine text={`positive:`} value={(good / (good + neutral + bad)) * 100}/>
    </>
  )
}
const StatisticLine = (props)=> <p>{props.text} {props.value}</p>


export default App