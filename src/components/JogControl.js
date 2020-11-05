import React, { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import {
  faArrowLeft,
  faArrowUp,
  faArrowRight,
  faArrowDown,
  faCompressAlt,
  faCompressArrowsAlt
} from '@fortawesome/free-solid-svg-icons'
import { JogButton } from './Buttons'
import { MOVE, STEP } from '../lib/constants'

const JogControl = ({ disabled, setRateVector }) => {
  const [step, setStep] = useState(1)
  const steps = [0.1, 0.5, 1, 5, 10, 50]


  const handleStepChange = e => {
    const { target } = e
    setStep(target.value)
    target.blur()
  }

  const jogButtons = [
    [
      {
        label: { icon: faArrowUp, transform: { rotate: -45 } },
        handleClick: () => setRateVector({ x: -step, y: step, type: STEP })
      },
      {
        label: { icon: faArrowUp },
        handleClick: () => setRateVector({ y: step, type: STEP })
      },
      {
        label: { icon: faArrowUp, transform: { rotate: 45 } },
        handleClick: () => setRateVector({ x: step, y: step, type: STEP })
      },
      {
        label: { icon: faArrowUp },
        handleClick: () => setRateVector({ z: step, type: STEP })
      }
    ], [
      {
        label: { icon: faArrowLeft },
        handleClick: () => setRateVector({ x: -step, type: STEP })
      },
      {
        label: { icon: faCompressArrowsAlt, transform: { rotate: -45 } },
        handleClick: () => setRateVector({ x: 0, y: 0, type: MOVE })
      },
      {
        label: { icon: faArrowRight },
        handleClick: () => setRateVector({ x: step, type: STEP })
      },
      {
        label: { icon: faCompressAlt, transform: { rotate: -45 } },
        handleClick: () => setRateVector({ z: 0, type: MOVE })
      }
    ], [
      {
        label: { icon: faArrowDown, transform: { rotate: 45 } },
        handleClick: () => setRateVector({ x: -step, y: -step, type: STEP })
      },
      {
        label: { icon: faArrowDown },
        handleClick: () => setRateVector({ y: -step, type: STEP })
      },
      {
        label: { icon: faArrowDown, transform: { rotate: -45 } },
        handleClick: () => setRateVector({ x: step, y: -step, type: STEP })
      },
      {
        label: { icon: faArrowDown },
        handleClick: () => setRateVector({ z: -step, type: STEP })
      }
    ], [
      {
        label: { icon: faCompressAlt, transform: { rotate: 45 } },
        handleClick: () => setRateVector({ x: 0, type: MOVE })
      },
      {
        label: { icon: faCompressAlt, transform: { rotate: -45 } },
        handleClick: () => setRateVector({ y: 0, type: MOVE })
      }
    ]
  ]

  return (
    <>
      {jogButtons.map((row, i) => (
        <Row key={`r_${i}`} noGutters>
          {row.map((jb, j) => (
            <Col key={`c_${i}_${j}`} className="m-1">
              <JogButton
                label={jb.label}
                onClick={jb.handleClick}
                disabled={disabled}
              />
            </Col>
          ))}
        </Row>
      ))}

      <Row>
        <Col className="mx-1">
          <Form.Group controlId="selectStep">
            <Form.Label>
              Step
          </Form.Label>
            <Form.Control as="select" placeholder="Step" value={step} onChange={handleStepChange}>
              {steps.map(
                (o, i) => <option key={`o_${i}`}>{o}</option>
              )}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </>
  )
}

export default JogControl
