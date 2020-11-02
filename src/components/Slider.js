import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import ConnectionForm from './ConnectionForm'
import Control from './Control'
import Status from './Status'
import { useController } from '../providers/ProvideController'

function Slider() {
  const { state, port, connected } = useController()
  const [joystickHasControl, setJoystickHasControl] = useState(false)

  if (connected) {
    return (
        <>
          <Row>
            <Col xs={3}>
              <h2 className="text-center">Connection</h2>
              <ConnectionForm control={joystickHasControl} />
            </Col>
            <Col xs={5}>
              <h2 className="text-center">Status</h2>
              {!!port && !!state.status && (
                <Status status={state.status} />
              )}
            </Col>
            <Col xs={4}>
              <h2 className="text-center">Control</h2>
              {!!port && (
                <Control
                  control={joystickHasControl ? 'joy' : 'jog'}
                  toggleControl={() => setJoystickHasControl(
                    !joystickHasControl
                  )}
                />
              )}
            </Col>
          </Row>
        </>
  )} else {
    return (
      <Row>
        <Col xs={{ span:6, offset:3}}>
          <h2>Slider</h2>
          <h4>Connecting...</h4>
        </Col>
      </Row>
    )
  }
}

export default Slider
