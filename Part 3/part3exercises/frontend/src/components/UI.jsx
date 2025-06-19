const Title = ({Icon, text }) => (
  <h2>
    <Icon />&nbsp;&nbsp;{text}
  </h2>
);

const Button = ({onClick, label}) => 
<button style={{width: 100, justifySelf: "center"}} onClick={onClick}>{label}</button> 

export {Title, Button}