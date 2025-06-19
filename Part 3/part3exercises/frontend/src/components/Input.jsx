

const Input = ({value, onChange, label = null, id = ""}) => {
  if (!label) return <input type="text" value={value} onChange={onChange} style={{width: "78%"}}/>
  return(
    <>
      <label htmlFor={id}>{label}&nbsp;</label>
      <input type="text" id={id} value={value} onChange={onChange}/>
    </>
  )
}

export default Input