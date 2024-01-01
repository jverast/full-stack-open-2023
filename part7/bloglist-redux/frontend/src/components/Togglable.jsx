import { useState } from 'react'
import { Button } from 'react-bootstrap'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => setVisible(!visible)

  return (
    <>
      <div
        style={{ display: visible ? 'none' : '' }}
        className="text-center mb-3"
      >
        <Button type="button" onClick={() => toggleVisible()} variant="primary">
          {props.labelButton}
        </Button>
      </div>
      <div
        style={{ display: visible ? '' : 'none' }}
        className="mb-3 text-center"
      >
        {props.children}
        <Button
          type="button"
          onClick={() => toggleVisible()}
          variant="outline-danger"
          size={'sm'}
          className="px-5"
        >
          cancel
        </Button>
      </div>
    </>
  )
}

export default Togglable
