const Person = ({name, number, onClick}) =>
  <li style={{width: "100%", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
    {name}  {number} 
  <button className="delBtn" onClick={onClick} >Delete</button>
  </li>

export default Person