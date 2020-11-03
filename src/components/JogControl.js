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

const JogControl = ({ disabled, jog, move }) => {
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
        handleClick: () => jog({ x: -step, y: step })
      },
      {
        label: { icon: faArrowUp },
        handleClick: () => jog({ y: step })
      },
      {
        label: { icon: faArrowUp, transform: { rotate: 45 } },
        handleClick: () => jog({ x: step, y: step })
      },
      {
        label: { icon: faArrowUp },
        handleClick: () => jog({ z: step })
      }
    ], [
      {
        label: { icon: faArrowLeft },
        handleClick: () => jog({ x: -step })
      },
      {
        label: { icon: faCompressArrowsAlt, transform: { rotate: -45 } },
        handleClick: () => move({ x: 0, y: 0 })
      },
      {
        label: { icon: faArrowRight },
        handleClick: () => jog({ x: step })
      },
      {
        label: { icon: faCompressAlt, transform: { rotate: -45 } },
        handleClick: () => move({ z: 0 })
      }
    ], [
      {
        label: { icon: faArrowDown, transform: { rotate: 45 } },
        handleClick: () => jog({ x: -step, y: -step })
      },
      {
        label: { icon: faArrowDown },
        handleClick: () => jog({ y: -step })
      },
      {
        label: { icon: faArrowDown, transform: { rotate: -45 } },
        handleClick: () => jog({ x: step, y: -step })
      },
      {
        label: { icon: faArrowDown },
        handleClick: () => jog({ z: -step })
      }
    ], [
      {
        label: { icon: faCompressAlt, transform: { rotate: 45 } },
        handleClick: () => move({ x: 0 })
      },
      {
        label: { icon: faCompressAlt, transform: { rotate: -45 } },
        handleClick: () => move({ y: 0 })
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
              {steps.map((o, i) => <option key={`o_${i}`}>{o}</option>)}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </>
  )
}

export default JogControl
