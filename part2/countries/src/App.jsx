import { useState, useEffect } from 'react'
import axios from 'axios'

const Results = ({search, result, oneCountry, viewCountry, weather, getWeather}) => {

  if (oneCountry != null) {
    getWeather(oneCountry.capitalInfo.latlng[0], oneCountry.capitalInfo.latlng[1]);
    return (
      <>
        <h1>{oneCountry.name.common}</h1>
        <div>capital {oneCountry.capital.map((c, i) => {
          if (i == 0) {
            return <span key = {c}>{c}</span>
          }
          return <span key = {c}>, {c}</span>
        })}</div>
        <div>area {oneCountry.area}</div>
        <h3>languages:</h3>
        <ul>
          {Object.values(oneCountry.languages).map(l => <li key = {l}>{l}</li>)}
        </ul>
        <img src = {oneCountry.flags.png} />
        <h3>Weather in {oneCountry.capital[0]}</h3>
        {weather == null ? <></> : <div>temperature {weather.temp} Celcius</div>}
        {weather == null ? <></> : <img src = {"https://github.com/visualcrossing/WeatherIcons/blob/main/PNG/1st%20Set%20-%20Color/" + weather.icon + ".png?raw=true"} />}
        {weather == null ? <></> : <div>wind {weather.windspeed} m/s</div>}
      </>
    )
  } else if(search == ""){
    return <div>Key in a search term to search</div>
  } else if(result.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (result.length != 1) {
    return <> {result.map(r => <div key = {r.name.common}>{r.name.common} <button onClick={() => viewCountry(r.name.common)}>show</button></div>) } </>
  }
}

function App() {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState([])
  const [oneCountry, setOneCountry] = useState(null)
  const [weather, setWeather] = useState(null);

  const getWeather = (lat, lng) => {
    axios.get( `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lng}?unitGroup=metric&include=current&key=${import.meta.env.VITE_WEATHER_KEY}&contentType=json`).then((response) => {
      setWeather(response.data.currentConditions)
    })
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const viewCountry = (country) => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`).then((response) => {
      setOneCountry(response.data)
      setWeather(null)
    })
  }

  useEffect(() => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`).then((response) => response.data).then((data) => {
      setOneCountry(null)
      const filteredResults = data.filter(d => d.name.common.toLowerCase().includes(search.toLowerCase()))
      setResults(filteredResults)
      if (filteredResults.length == 1) {
        axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filteredResults[0].name.common}`).then((response) => {
          setOneCountry(response.data)
          setWeather(null)
        })
      }
    })
  }, [search])

  return (
    <>
      <div>find countries <input value={search} onChange={handleSearch}/></div>
      <Results search = {search} result = {results} oneCountry = {oneCountry} viewCountry={viewCountry} getWeather={getWeather} weather={weather}/>
    </>
  )
}

export default App
