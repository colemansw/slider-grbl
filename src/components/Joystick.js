import React, { useState, useEffect } from 'react'
import { ToggleButton, ToggleButtonGroup, Col, Row } from 'react-bootstrap'
import ReactNipple from 'react-nipple'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faStop
} from '@fortawesome/free-solid-svg-icons'

const RATE_SCALE = 10
const DISTANCE_SCALE = 0.1

const Joystick = ({ jog, setJogCancelled, isOk, setIsOk, trackState, setTrackState }) => {
  const [rateVector, setRateVector] = useState({ x: 0, y: 0, z: 0, rate: 0 })

  const updatePosition = (e, data) => {
    const { angle: { radian = 0 } = {}, distance = 0 } = data
    if (distance !== 0) {
      const newVector = {
        x: Math.cos(radian) * DISTANCE_SCALE,
        y: Math.sin(radian) * DISTANCE_SCALE,
        rate: distance * RATE_SCALE
      }
      setRateVector(oldVector => ({
        ...oldVector,
        ...newVector
      }))
    }
  }

  const handleChange = (val, e) => {
    e.currentTarget.blur()
    setTrackState(val)
  }

  useEffect(() => {
    if (!isOk) return
    if (trackState === 0) {
      setJogCancelled(true)
      return
    }
    jog({ z: trackState }, false, 200)
    setIsOk(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackState, isOk])

  useEffect(() => {
    if (!isOk) return
    const { rate, ...xyz } = rateVector
    if (rate === 0) return
    jog(xyz, false, rate.toFixed(3))
    setIsOk(false)
  }, [rateVector, jog, isOk, setIsOk])

  const trackButtons = [
    <FontAwesomeIcon icon={faArrowLeft} />,
    <FontAwesomeIcon icon={faStop} />,
    <FontAwesomeIcon icon={faArrowRight} />
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
              setJogCancelled(true)
            }}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <ToggleButtonGroup type="radio" value={trackState} name="track" onChange={handleChange}>
          {trackButtons.map((icon, index) => (
            <ToggleButton value={(index - 1) * 0.5} variant="outline-dark">
              {icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Row>
    </>
  )
}

export default Joystick
