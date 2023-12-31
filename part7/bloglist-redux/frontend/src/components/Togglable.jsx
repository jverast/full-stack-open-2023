import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => setVisible(!visible)

  return (
    <>
      <div style={{ display: visible ? 'none' : '' }}>
        <button type="button" onClick={() => toggleVisible()}>
          {props.labelButton}
        </button>
      </div>
      <div style={{ display: visible ? '' : 'none' }}>
        {props.children}
        <button type="button" onClick={() => toggleVisible()}>
          cancel
        </button>
      </div>
    </>
  )
}

export default Togglable
