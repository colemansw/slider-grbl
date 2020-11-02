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
    { precision: 3, separator: ' ' }
  )} S${shutter} F${(MS_IN_MINUTE / interval).toFixed(3)}\n`
)

const steps = (deltaPos, endPosition, totalTime, closedInterval, shutterInterval) => (
  {
    openStep: step(
      calculateStep(
        deltaPos,
        shutterInterval / totalTime
      ),
      shutterInterval,
      OPEN
    ),
    closedStep: step(
      calculateStep(
        deltaPos,
        closedInterval / totalTime
      ),
      closedInterval,
      CLOSED
    ),
    endStep: step(
      endPosition,
      shutterInterval,
      OPEN
    )
  }
)

function* gCode({ closedStep, openStep, endStep }, frames) {
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
  yield `G0 ${parsePosition(
    startPosition,
    { precision: 3, separator: ' ' }
  )}\n` // Move to first position.
  yield 'G4 P2\n' // Pause for 2 seconds.
  yield 'G93\n' // G93 - inverse time mode.
 
  const { frames, interval, shutterSpeed } = toNumbers(keyframes[1].transition)
  let endPosition = toNumbers(keyframes[1].position)
  let shutterInterval = shutterSpeed <= 200 ? 200 : shutterSpeed
  const { openStep, closedStep, endStep } = steps(
    objDiff(AXES, startPosition, endPosition),
    endPosition,
    (frames - 1) * interval * 1000 + shutterInterval,
    interval * 1000 - shutterInterval,
    shutterInterval
  )
  yield 'G91\n'
  yield openStep
  yield* gCode({ closedStep, openStep, endStep }, frames - 1)
  for (let keyframe of keyframes.slice(2)) {
    startPosition = endPosition
    endPosition = toNumbers(keyframe.position)
    const { frames, interval, shutterSpeed } = toNumbers(keyframe.transition)
    shutterInterval = shutterSpeed <= 200 ? 200 : shutterSpeed
    yield* gCode(
      steps(
        objDiff(AXES, startPosition, endPosition),
        endPosition,
        frames * interval * 1000,
        interval * 1000 - shutterInterval,
        shutterInterval
      ),
      frames
    )
  }
  yield 'M5\n' // M5 deactivate (laser) shutter
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
