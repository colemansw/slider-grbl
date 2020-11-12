import { toNumbers, objDiff, parsePosition } from './utils'
import { OPEN, CLOSED, MS_IN_MINUTE, AXES } from './constants'

const calculateStep = (position, factor) => Object.assign(
  ...AXES.map(axis => ({
    [axis]: position[axis] * factor
  }))
)

const step = (position, interval, shutter) => (
  `G1 ${parsePosition(
    position,
    { separator: ' ' }
  )} S${shutter} F${(MS_IN_MINUTE / interval).toFixed(3)}\n`
)

function* gCode(closedStep, openStep, endStep, frames) {
  while (frames > 1) {
    yield closedStep
    yield openStep
    frames -= 1
  }
  yield closedStep
  yield 'G90\n' // Move to absolute position.
  yield endStep
  yield 'G91\n' // Move to relative position.
}

export function* gCodeGenerator(keyframes) {
  let startPosition = toNumbers(keyframes[0].position)

  yield 'G90\n' // Move to absolute position.
  yield 'M3 S0\n' // M3 - activate (laser) shutter, S0 -> 0volts.
  yield `G0 ${parsePosition(startPosition, { separator: ' ' })}\n` // Move to first position.
  yield 'G4 P2\n' // Pause for 2 seconds.
  yield 'G93\n' // G93 - inverse time mode.

  let endPosition = toNumbers(keyframes[1].position)
  const { openStep, closedStep, endStep, frames } = steps(
    startPosition,
    endPosition,
    toNumbers(keyframes[1].transition),
    firstInterval
  )

  yield 'G91\n'
  yield openStep
  yield* gCode(closedStep, openStep, endStep, frames - 1)

  for (let keyframe of keyframes.slice(2)) {
    startPosition = endPosition
    endPosition = toNumbers(keyframe.position)
    const { openStep, closedStep, endStep, frames } = steps(
      startPosition,
      endPosition,
      toNumbers(keyframe.transition),
      otherIntervals
    )
    yield* gCode(openStep, closedStep, endStep, frames)
  }

  yield 'M5\n' // M5 deactivate (laser) shutter
}

const firstInterval = (...args) => {
  const [frames, interval, shutterInterval] = args
  return (frames - 1) * interval * 1000 - shutterInterval
}

const otherIntervals = (...args) => {
  const [frames, interval] = args
  return frames * interval * 1000
}

const steps = (startPosition, endPosition, transition, intervalFn) => {
  const { frames, interval, shutterSpeed } = transition
  const shutterInterval = shutterSpeed <= 200 ? 200 : shutterSpeed
  const positionDelta = objDiff(AXES, startPosition, endPosition)
  const totalTime = intervalFn(frames, interval, shutterInterval)
  const closedInterval = interval * 1000 - shutterInterval

  return {
    openStep: step(
      calculateStep(
        positionDelta,
        shutterInterval / totalTime
      ),
      shutterInterval,
      OPEN
    ),
    closedStep: step(
      calculateStep(
        positionDelta,
        closedInterval / totalTime
      ),
      closedInterval,
      CLOSED
    ),
    endStep: step(
      endPosition,
      shutterInterval,
      OPEN
    ),
    frames
  }
}

function gCodeBlob(keyframes) {
  const options = { type: 'text/plain' }
  let blob = new Blob([], options)
  for (let line of gCodeGenerator(keyframes)) {
    blob = new Blob([blob, line], options)
  }
  return blob
}

export function downloadBlob(keyframes) {
  const url = URL.createObjectURL(gCodeBlob(keyframes))
  const timestamp = new Date()
  const a = document.createElement('a')
  a.href = url
  a.download = `shot_${timestamp.toISOString()}.gcode`
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url)
      a.removeEventListener('click', clickHandler)
    }, 150)
  }
  a.addEventListener('click', clickHandler, false)
  a.click()
  return a
}
