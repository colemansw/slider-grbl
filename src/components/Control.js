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

const Control = ({ toggleControl, control }) => {
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
  const [jogCancelled, setJogCancelled] = useState(false)
  const [trackState, setTrackState] = useState(0)

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
    if (jogCancelled) {
      jogCancel()
      setTrackState(0)
      setJogCancelled(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jogCancelled])

  useEffect(() => {
    switch (status.activeState) {
      case 'Alarm':
        setReadyState({
          variant: 'warning',
          command: () => controllerCommand('unlock'),
          label: <FontAwesomeIcon icon={faUnlock} />,
          title: 'Unlock'
        })
        break
      case 'Sleep':
        setReadyState({
          variant: 'danger',
          command: () => controllerCommand('reset'),
          label: <FontAwesomeIcon icon={faRedo} transform="shrink-5" mask={faCog} />,
          title: 'Reset'
        })
        break
      case '':
      case undefined:
      case null:
        setReadyState({
          variant: 'secondary',
          label: <FontAwesomeIcon icon={faSpinner} spin />,
          command: null,
          title: 'Connecting...'
        })
        break
      case 'Jog':
        setReadyState({
          variant: 'secondary',
          command: () => setJogCancelled(true),
          label: <FontAwesomeIcon icon={faStop} />,
          title: 'Stop'
        })
        break
      default:
        setReadyState({
          variant: 'info',
          command: () => controllerCommand('sleep'),
          label: <FontAwesomeIcon icon={faBed} />,
          title: 'Sleep'
        })
    }
  }, [status, controllerCommand, jogCancel])

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
        <JogControl
          jog={jog}
          disabled={status.activeState !== 'Idle'}
          move={move}
        />
      ) : (
          <Joystick
            jog={jog}
            setJogCancelled={setJogCancelled}
            isOk={isOk}
            setIsOk={setIsOk}
            trackState={trackState}
            setTrackState={setTrackState}
          />
        )}
    </>
  )
}

export default Control
