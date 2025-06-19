const Title = ({text, Icon = null }) => {
  if (!Icon ) return <h2>{text}</h2>
  return (
  <h2>
    <Icon />&nbsp;&nbsp;{text}
  </h2>
);}

const Button = ({onClick, label}) => 
<button style={{width: 100, justifySelf: "center"}} onClick={onClick}>{label}</button> 

export {Title, Button}