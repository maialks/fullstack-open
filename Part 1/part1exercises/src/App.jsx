import { useState } from "react"

const App = ()=> {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let all = good + bad+ neutral

  const handleGood = () => function(){
    console.log("good")
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
  return(
    <table>
      <tbody>
      <StatisticTableRow col1={"good:"} col2={good}/>
      <StatisticTableRow col1={"neutral:"} col2={neutral}/>
      <StatisticTableRow col1={"bad:"} col2={bad}/>
      <StatisticTableRow col1={"average:"} col2={calclAvg()}/>
      <StatisticTableRow col1={"positive:"} col2={((good / (good + neutral + bad)) * 100) + "%"}/>
      </tbody>
    </table>
  )
}
const StatisticTableRow = (props)=> <tr><StatisticTableCell value = {props.col1}/><StatisticTableCell value = {props.col2}/></tr>
const StatisticTableCell =(props)=> <td>{props.value}</td>


export default App