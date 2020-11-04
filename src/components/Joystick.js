import React, { useState, useEffect } from 'react'
import { Col, Row, Form } from 'react-bootstrap'
import ReactNipple from 'react-nipple'

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

  const handleChange = e => {
    const { target } = e
    setTrackState(target.value)
  }

  useEffect(() => {
    if (!isOk) return
    if (trackState === 0) {
      return
    }
    jog({ z: trackState/50.0 }, false, 400)
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
        <Form.Group controlId="trackRange">
          <Form.Label>Track</Form.Label>
          <Form.Control
            type="range"
            custom
            name="track"
            value={trackState}
            onChange={handleChange}
            min="-50"
            max="50"
            onMouseUp={(e) => {
              e.currentTarget.blur()
              setTrackState(0)
              setJogCancelled(true)
            }}
          />
        </Form.Group>
      </Row>
    </>
  )
}

export default Joystick
