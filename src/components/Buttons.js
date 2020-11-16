import React from 'react'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faEdit,
  faSync,
  faCrosshairs,
  faPlus,
  faDotCircle,
  faArrowsAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons'

import { blurClick } from '../lib/utils'

const blur = (f, e) => {
  e.preventDefault()
  const { currentTarget } = e
  f()
  currentTarget.blur()
}

export const AddKeyframeButton = ({
  setKeyframes,
  length,
  currentPosition,
  setCurrentSelection,
  setShowEdit,
  disabled
}) => {

  const handleClick = () => {
    setKeyframes(
      keyframes => [
        ...keyframes,
        { position: currentPosition }

      ]
    )
    setCurrentSelection(length)
    if (length > 0) setShowEdit(true)
  }

  return (
    <Button
      className="mr-2"
      variant="warning"
      onClick={e => blur(handleClick, e)}
      title="Add new keyframe"
      disabled={disabled}
    >
      <FontAwesomeIcon icon={faPlus} />
    </Button>
  )
}

export const DeleteKeyframeButton = ({
  setKeyframes,
  length,
  currentSelection,
  setCurrentSelection,
  disabled
}) => {
  const handleClick = () => {
    setCurrentSelection(null)
    if (length === 1) {
      setKeyframes([])
      return
    }
    if (currentSelection === 0) {
      setKeyframes(keyframes => [
        { position: { ...keyframes[1].position } },
        ...keyframes.slice(2)
      ])
      return
    }
    setKeyframes(keyframes => [
      ...keyframes.slice(0, currentSelection),
      ...keyframes.slice(currentSelection + 1)
    ])
  }
  return (
    <Button
      variant="danger"
      onClick={e => blur(handleClick, e)}
      title="Delete selected keyframe"
      disabled={disabled}
    >
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  )
}

export const UpdateKeyframeButton = ({
  setKeyframes,
  currentSelection,
  currentPosition,
  disabled
}) => {
  const handleClick = () => {
    setKeyframes(keyframes => [
      ...keyframes.slice(0, currentSelection),
      {
        position: { ...currentPosition },
        transition: keyframes[currentSelection].transition
      },
      ...keyframes.slice(currentSelection + 1)
    ])
  }
  return (
    <Button
      variant="secondary"
      onClick={e => blur(handleClick, e)}
      title=" Set selected keyframe to current position"
      disabled={disabled}
    >
      <FontAwesomeIcon icon={faSync} />
    </Button>
  )
}
export const GoToPositionButton = ({ onClick, disabled }) => {

  return (
    <Button
      variant="dark"
      onClick={e => blur(onClick, e)}
      title=" Go to selected position"
      disabled={disabled}
    >
      <FontAwesomeIcon icon={faCrosshairs} />
    </Button>
  )
}

export const EditTransitionButton = ({ selectionIsOK, setShowEdit, disabled }) => {
  const handleClick = () => {
    if (selectionIsOK) setShowEdit(true)
  }
  return (
    <Button
      variant="info"
      onClick={e => blur(handleClick, e)}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={faEdit} />
    </Button>
  )
}

export const GCodeButton = ({ onClick, icon, ...rest }) => {
  return (
    <Button onClick={e => blur(onClick, e)} {...rest}>
      <FontAwesomeIcon icon={icon} />
    </Button>
  )
}

export const ReadyButton = ({ label, command, variant, title }) => {
  const handleButton = (cmd, e) => {
    const { currentTarget: target } = e
    cmd && cmd()
    setTimeout(() => target.blur(), 500)
  }
  return (
    <Button {...{
      variant,
      className: 'btn-block',
      ...command ? { onClick: e => handleButton(command, e) } : {},
      title
    }}><FontAwesomeIcon {...label} /></Button>
  )
}

export const JogButton = ({ label, onClick, ...rest }) => {
  const handleClick = e => {
    const { currentTarget: target } = e
    onClick()
    target.blur()
  }
  return (
    <Button
      className="btn-block"
      variant="outline-dark"
      onClick={handleClick}
      {...rest}
    >
      <FontAwesomeIcon {...label} />
    </Button>
  )
}

export const ControlButton = ({ toggleControl, control }) => {
  const controlSelect = {
    jog: {
      icon: faDotCircle,
      title: 'Joystick control'
    },
    joy: {
      icon: faArrowsAlt,
      title: 'Jog control'
    }
  }

  return (
    <Button
      className="btn-block"
      variant="secondary"
      onClick={e => blurClick(toggleControl, e)}
      title={controlSelect[control].title}
    >
      <FontAwesomeIcon icon={controlSelect[control].icon} />
    </Button>
  )
}

export const HomeButton = ({ status, handleClick }) => {
  const { activeState } = status
  return (
    <Button
      className="btn-block"
      variant="dark"
      title="Home"
      onClick={e => blurClick(handleClick, e)}
      disabled={activeState === 'Run' || activeState === 'Jog' || activeState === 'Sleep'}
      >
        <FontAwesomeIcon icon={faHome} />
      </Button>
  )
}
