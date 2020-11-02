import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUnlock,
  faRedo,
  faSpinner,
  faStop,
  faBed,
  faCog,
  faDotCircle,
  faArrowsAlt
} from '@fortawesome/free-solid-svg-icons'
import { ReadyButton } from './Buttons'
import { useController } from '../providers/ProvideController'
import JogControl from './JogControl'
import Joystick from './Joystick'
import { blurClick } from '../lib/utils'

const Control = ({ toggleControl, control }) => {
  const [stepIndex, setStepIndex] = useState({ jog: 2, joy: 2 })
  const controlSelect = {
    jog: {
      steps: [0.1, 0.5, 1, 5, 10, 50],
      button: {
        icon: faDotCircle,
        title: 'Joystick control'
      }
    },
    joy: {
      steps: [1, 5, 10, 50, 100, 500],
       button: {
        icon: faArrowsAlt,
        title: 'Jog control'
      }
    }
  }
  const {
    state,
    jog,
    move,
    jogCancel,
    controllerCommand,
    setIsOk,
    isOk } = useController()
  const { status = {} } = state
  const [readyState, setReadyState] = useState()


  const handleStepChange = e => {
    const { target } = e
    setStepIndex(index => ({
      ...index,
      [control]: target.selectedIndex
    }))
    target.blur()
  }

  useEffect(() => {
    switch (status.activeState) {
      case 'Alarm':
        setReadyState({
          variant: 'warning',
          command: () => controllerCommand('unlock'),
          text: <FontAwesomeIcon icon={faUnlock} />
        })
        break
      case 'Sleep':
        setReadyState({
          variant: 'danger',
          command: () => controllerCommand('reset'),
          text: <FontAwesomeIcon icon={faRedo} transform="shrink-5" mask={faCog} />
        })
        break
      case '':
      case undefined:
      case null:
        setReadyState({
          variant: 'secondary',
          text: <FontAwesomeIcon icon={faSpinner} spin />,
          command: null
        })
        break
      case 'Jog':
        setReadyState({
          variant: 'secondary',
          command: () => jogCancel(),
          text: <FontAwesomeIcon icon={faStop} />
        })
        break
      default:
        setReadyState({
          variant: 'info',
          command: () => controllerCommand('sleep'),
          text: <FontAwesomeIcon icon={faBed} />
        })
    }
  }, [status, controllerCommand, jogCancel])

  const controlProps = {
    jog,
    move,
    disabled: status.activeState !== 'Idle',
    step: controlSelect[control].steps[stepIndex[control]],
    ...control && {
      jogCancel,
      isOk,
      setIsOk
    }
  }

  return (
    <>
      <Row className="mb-1" noGutters>
        <Col className="mx-1">
          <ReadyButton  {...readyState} />
        </Col>
        <Col className="mx-1">
          <Button
            className="btn-block"
            variant="secondary"
            onClick={e => blurClick(toggleControl, e)}
            title={controlSelect[control].button.title}
          >
            <FontAwesomeIcon icon={controlSelect[control].button.icon} />
          </Button>
        </Col>
      </Row>
      {control === 'jog' ? (
        <JogControl {...controlProps} />
      ) : (
          <Joystick {...controlProps} />
        )}
      <Row>
        <Col className="mx-1">
          <Form.Group controlId="selectStep">
            <Form.Label>
              Step
          </Form.Label>
            <Form.Control as="select" placeholder="Step" value={controlProps.step} onChange={handleStepChange}>
              {controlSelect[control].steps.map((o, i) => <option key={`o_${i}`}>{o}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </>
  )
}

export default Control
