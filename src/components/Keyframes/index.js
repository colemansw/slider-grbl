import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  Col,
  ButtonGroup,
  ButtonToolbar,
  Row,
  Table
} from 'react-bootstrap'
import {
  faRunning,
  faStop,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import EditTransition from './EditTransition'
import Keyframe from './Keyframe'
import { useController } from '../../providers/ProvideController'
import {
  AddKeyframeButton,
  DeleteKeyframeButton,
  UpdateKeyframeButton,
  GoToPositionButton,
  EditTransitionButton,
  GCodeButton
} from '../Buttons'
import { gCodeGenerator, downloadBlob } from '../../lib/gCodeGenerator'

const Keyframes = ({ currentPosition }) => {
  const {
    keyframes,
    setKeyframes,
    state,
    jog,
    isOk,
    setIsOk,
    controllerCommand
  } = useController()
  const [currentSelection, setCurrentSelection] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [next, setNext] = useState(null)
  const genRef = useRef()

  const { status = {} } = state

  const handleSubmit = (data) => {
    keyframes[currentSelection].transition = { ...data }
    setShowEdit(false)
  }

  const handleRun = () => {
    genRef.current = gCodeGenerator([...keyframes])
    setIsRunning(true)
    setNext(genRef.current.next())
    setIsOk(true)
  }

  const handleStop = () => {
    setIsRunning(false)
    genRef.current = null
    controllerCommand('gcode:stop', { force: true })
  }

  const getNextLine = useCallback(() => {
    const { value, done } = next || {}
    if (value) {
      controllerCommand('gcode', value)
      setIsOk(false)
      setNext(genRef.current.next())
    }
    if (done) {
      setIsRunning(false)
      genRef.current = null
    }
  },
    [next, setIsOk, controllerCommand],
  )

  useEffect(() => {
    if (isOk && isRunning) {
      getNextLine()
    }
  }, [isOk, isRunning, getNextLine])

  const isDisabled = currentSelection === null || status.activeState !== 'Idle'
  const gCodeRun = isRunning ? ({
    onClick: handleStop,
    variant: 'danger',
    title: 'Stop G-Code',
    disabled: status.activeState !== 'Run',
    icon: faStop
  }) : ({
    onClick: handleRun,
    variant: 'warning',
    title: 'Run G-Code',
    disabled: status.activeState !== 'Idle',
    icon: faRunning
  })
  return (
    <>
      <Row>
        <Col>
          <h4 className="text-center">Key frames</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table bordered hover>
            <thead>
              <tr className="text-center">
                {['X', 'Y', 'Z', 'F', 'I', 'S'].map((t) => (
                  <th key={`t_${t}`}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keyframes.map((k, i) => (
                <Keyframe key={`p_${i}`}
                  keyframe={k}
                  onClick={() => setCurrentSelection(i)}
                  isSelected={i === currentSelection}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonToolbar>
            <AddKeyframeButton
              setKeyframes={setKeyframes}
              length={keyframes.length}
              currentPosition={currentPosition}
              setCurrentSelection={setCurrentSelection}
              setShowEdit={setShowEdit}
              disabled={status.activeState !== 'Idle'}
            />
            <ButtonGroup className="mr-2">
              <DeleteKeyframeButton
                setKeyframes={setKeyframes}
                length={keyframes.length}
                currentSelection={currentSelection}
                setCurrentSelection={setCurrentSelection}
                disabled={isDisabled}
              />
              <UpdateKeyframeButton
                setKeyframes={setKeyframes}
                currentSelection={currentSelection}
                currentPosition={currentPosition}
                disabled={isDisabled}
              />
              <GoToPositionButton
                onClick={() => jog(keyframes[currentSelection].position, true)}
                disabled={isDisabled}
              />
            </ButtonGroup>
            {keyframes.length > 1 && (
              <ButtonGroup id="frameButtons" >
                <EditTransitionButton
                  selectionIsOK={currentSelection > 0 && currentSelection < keyframes.length}
                  disabled={!!!currentSelection || status.activeState !== 'Idle'}
                  setShowEdit={setShowEdit}
                />
                <GCodeButton
                  variant="success"
                  title="Download G-Code"
                  onClick={() => downloadBlob(keyframes)}
                  disabled={status.activeState !== 'Idle'}
                  icon={faDownload}
                />
                <GCodeButton {...gCodeRun} />
              </ButtonGroup>
            )}
          </ButtonToolbar>
        </Col>
      </Row>
      <EditTransition
        current={!!currentSelection ? keyframes[currentSelection].transition : null}
        show={showEdit}
        handleClose={() => setShowEdit(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default Keyframes
