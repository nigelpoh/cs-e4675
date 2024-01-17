const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {
      parts.map(part => <Part part={part} key = {part.id}/>)
    }     
  </>

const Course = ({ course }) => {
  var total = course.parts.map(part => part.exercises).reduce((acc, curr) => acc + curr)
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={total} />
    </>
  )
}

export default Course;