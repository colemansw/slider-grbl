import React, { useState, useEffect } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ReactNipple from 'react-nipple'
import {
  faArrowLeft,
  faArrowRight,
  faCompressAlt,
} from '@fortawesome/free-solid-svg-icons'
import { JogButton } from './Buttons'

const RATE_SCALE = 10
const DISTANCE_SCALE = 0.1

const Joystick = ({ jog, jogCancel, move, isOk, setIsOk, step, disabled }) => {
  const [rateVector, setRateVector] = useState({ x: 0, y: 0, rate: 0 })

  const updatePosition = (e, data) => {
    const { angle: { radian = 0 } = {}, distance = 0 } = data
    if (distance !== 0) {
      const newVector = {
        x: Math.cos(radian) * DISTANCE_SCALE,
        y: Math.sin(radian) * DISTANCE_SCALE,
        rate: distance * RATE_SCALE
      }
      setRateVector(newVector)
    }
  }

  useEffect(() => {
    if (!isOk) return
    const { rate, ...xy } = rateVector
    if (rate === 0) return
    jog(xy, false, rate.toFixed(3))
    setIsOk(false)
  }, [rateVector, jog, isOk, setIsOk])

  const jogButtons = [
    {
      label: { icon: faArrowLeft },
      handleClick: () => jog({ z: -step })
    },
    {
      label: { icon: faCompressAlt, transform: { rotate: 45 } },
      handleClick: () => move({ z: 0 })
    },
    {
      label: { icon: faArrowRight },
      handleClick: () => jog({ z: step })
    }
  ]

  return (
    <>
      <Row>
        <Col className="mx-1">
          <ReactNipple
            options={{
              color: 'grey',
              mode: 'static',
              position: {
                top: '50%',
                left: '50%'
              }
            }}
            style={{
              width: '100%',
              height: 150,
              position: 'relative'
            }}
            onMove={updatePosition}
            onEnd={() => {
              setRateVector({ x: 0, y: 0, rate: 0 })
              jogCancel()
            }}
          />
        </Col>
      </Row>
      <Row noGutters>
        {jogButtons.map((jb, i) => (
          <Col key={`c_${i}`} className="m-1">
            <JogButton
              label={jb.label}
              onClick={jb.handleClick}
              disabled={disabled}
            />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Joystick
