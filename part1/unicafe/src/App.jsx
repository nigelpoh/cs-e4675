import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const getAverage = (good, neutral, bad) => {
    if (good + neutral + bad == 0) {
      return 0;
    }

    var total_score = good - bad;
    return Math.round(total_score / (good + neutral + bad) * 100) / 100;
  }

  const getPositivePercentage = (good, neutral, bad) => {
    if (good + neutral + bad == 0) {
      return 0;
    }

    return Math.round(good / (good + neutral + bad) * 100 * 100) / 100;
  }
  if (props.good + props.neutral + props.bad == 0) {
    return (
      <>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text = {"good"} value = {props.good} />
          <StatisticsLine text = {"neutral"} value = {props.neutral} />
          <StatisticsLine text = {"bad"} value = {props.bad} />
          <StatisticsLine text = {"all"} value = {props.good + props.neutral + props.bad} />
          <StatisticsLine text = {"average"} value = {getAverage(props.good, props.neutral, props.bad)} />
          <StatisticsLine text = {"positive"} value = {getPositivePercentage(props.good, props.neutral, props.bad) + " %"} />
        </tbody>      
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text = {"good"}/>
      <Button handleClick={() => setNeutral(neutral + 1)} text = {"neutral"}/>
      <Button handleClick={() => setBad(bad + 1)} text = {"bad"}/>
      <Statistics good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
}

export default App