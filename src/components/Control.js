import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import {
  faUnlock,
  faRedo,
  faSpinner,
  faStop,
  faBed,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import { ReadyButton, ControlButton, HomeButton } from './Buttons'
import { useController } from '../providers/ProvideController'
import JogControl from './JogControl'
import Joystick from './Joystick'
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
  const [rateVector, setRateVector] = useState({})

  const controllerButton = activeState => {
    switch (activeState) {
      case 'Alarm':
        return {
          variant: 'warning',
          command: () => controllerCommand('unlock'),
          label: { icon: faUnlock },
          title: 'Unlock'
        }
      case 'Sleep':
        return {
          variant: 'danger',
          command: () => controllerCommand('reset'),
          label: {icon:faRedo, transform: "shrink-5", mask:faCog},
          title: 'Reset'
        }
      case '':
      case undefined:
      case null:
        return {
          variant: 'secondary',
          label: {icon:faSpinner, spin: true},
          command: null,
          title: 'Connecting...'
        }
      case 'Jog':
        return {
          variant: 'secondary',
          command: () => setRateVector(v => ({
            ...v,
            type: STOP
          })),
          label: {icon: faStop},
          title: 'Stop'
        }
      default:
        return {
          variant: 'info',
          command: () => controllerCommand('sleep'),
          label: {icon:faBed},
          title: 'Sleep'
        }
    }
  }

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
          <ReadyButton  {...controllerButton(status.activeState)} />
        </Col>
        <Col>
        <HomeButton
          status={status}
          handleClick={() => {
            controllerCommand('homing')
          }}
        />
        </Col>
        <Col className="mx-1">
          <ControlButton
            toggleControl={toggleControl}
            control={control}
          />
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
