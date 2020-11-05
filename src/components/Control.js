import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
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
import { STOP, MOVE, STEP, STEPPED } from '../lib/constants'

const Control = ({ toggleControl, control }) => {
  const {
    state,
    jog,
    jogCancel,
    controllerCommand,
    setIsOk,
    isOk } = useController()
  const { status = {} } = state
  const [controllerState, setControllerState] = useState()
  const [rateVector, setRateVector] = useState({})

  const controlSelect = {
    jog: {
      button: {
        icon: faDotCircle,
        title: 'Joystick control'
      },
    },
    joy: {
      button: {
        icon: faArrowsAlt,
        title: 'Jog control'
      },

    }
  }

  useEffect(() => {
    switch (status.activeState) {
      case 'Alarm':
        setControllerState({
          variant: 'warning',
          command: () => controllerCommand('unlock'),
          label: <FontAwesomeIcon icon={faUnlock} />,
          title: 'Unlock'
        })
        break
      case 'Sleep':
        setControllerState({
          variant: 'danger',
          command: () => controllerCommand('reset'),
          label: <FontAwesomeIcon icon={faRedo} transform="shrink-5" mask={faCog} />,
          title: 'Reset'
        })
        break
      case '':
      case undefined:
      case null:
        setControllerState({
          variant: 'secondary',
          label: <FontAwesomeIcon icon={faSpinner} spin />,
          command: null,
          title: 'Connecting...'
        })
        break
      case 'Jog':
        setControllerState({
          variant: 'secondary',
          command: () => setRateVector(v => ({
            ...v,
            type: STOP
          })),
          label: <FontAwesomeIcon icon={faStop} />,
          title: 'Stop'
        })
        break
      default:
        setControllerState({
          variant: 'info',
          command: () => controllerCommand('sleep'),
          label: <FontAwesomeIcon icon={faBed} />,
          title: 'Sleep'
        })
    }
  }, [status, controllerCommand, jogCancel])

  useEffect(() => {
    if (!isOk) return
    const { rate = 200, type = STOP, ...xyz } = rateVector
    if (type === STEPPED) return
    if (rate === 0 || type === STOP) {
      jogCancel()
      return
    }
    jog(xyz, type === MOVE, rate.toFixed(3))
    setIsOk(false)
    if (type === STEP || type === MOVE) {
      setRateVector(v => ({
        ...v,
        type: STEPPED
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rateVector, isOk])


  return (
    <>
      <Row className="mb-1" noGutters>
        <Col className="mx-1">
          <ReadyButton  {...controllerState} />
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
        <JogControl
          disabled={status.activeState !== 'Idle'}
          setRateVector={setRateVector}
        />
      ) : (
          <Joystick setRateVector={setRateVector} />
        )}
    </>
  )
}

export default Control
