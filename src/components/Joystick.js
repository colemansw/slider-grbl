import React, { useState, useEffect } from 'react'
import { Col, Row, Form } from 'react-bootstrap'
import ReactNipple from 'react-nipple'
import { STARTED, STOP } from '../lib/constants'

const RATE_SCALE = 10
const DISTANCE_SCALE = 0.1

const Joystick = ({ setRateVector }) => {
  const [track, setTrack] = useState(0)

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
        ...newVector,
        type: STARTED
      }))
    }
  }

  const handleChange = e => {
    const { target: { value } } = e
    setTrack(value)
  }

  useEffect(() => {
    if (track === 0) {
      setRateVector({rate:0, type: STOP})
      return
    }
    setRateVector({
      z: Math.sign(track) * DISTANCE_SCALE,
      rate: Math.abs(track) * RATE_SCALE,
      type: STARTED
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track])

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
            onStart={() => {
              setRateVector(vector => ({
                ...vector,
                type: STARTED
              }))
            }}
            onMove={updatePosition}
            onEnd={() => {
              setRateVector({ x: 0, y: 0, rate: 0, type: STOP })
              // setJogCancelled(true)
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
            value={track}
            onChange={handleChange}
            min="-50"
            max="50"
            onMouseDown={() => {
              setRateVector({
                rate: 0,
                type: STARTED
              })
            }}
            onMouseUp={(e) => {
              e.currentTarget.blur()
              setTrack(0)
            }}
          />
        </Form.Group>
      </Row>
    </>
  )
}

export default Joystick
