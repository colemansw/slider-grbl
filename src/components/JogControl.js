import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {
  faArrowLeft,
  faArrowUp,
  faArrowRight,
  faArrowDown,
  faCompressAlt,
  faCompressArrowsAlt
} from '@fortawesome/free-solid-svg-icons'
import { JogButton } from './Buttons'

const JogControl = ({ disabled, jog, move, step }) => {

  const jogButtons = [
    [
      {
        label: { icon:faArrowUp, transform:{ rotate: -45 } },
        handleClick: () => jog({ x: -step, y: step })
      },
      {
        label: { icon: faArrowUp },
        handleClick: () => jog({ y: step })
      },
      {
        label: { icon:faArrowUp, transform: { rotate: 45 }},
        handleClick: () => jog({ x: step, y: step })
      },
      {
        label: { icon:faArrowUp},
        handleClick: () => jog({ z: step })
      }
    ], [
      {
        label: { icon:faArrowLeft},
        handleClick: () => jog({ x: -step })
      },
      {
        label: { icon:faCompressArrowsAlt, transform:{ rotate: -45 }},
        handleClick: () => move({ x: 0, y: 0 })
      },
      {
        label: {icon: faArrowRight},
        handleClick: () => jog({ x: step })
      },
      {
        label: {icon: faCompressAlt, transform:{ rotate: -45 }},
        handleClick: () => move({ z: 0 })
      }
    ], [
      {
        label: {icon: faArrowDown, transform: { rotate: 45 }},
        handleClick: () => jog({ x: -step, y: -step })
      },
      {
        label: {icon: faArrowDown},
        handleClick: () => jog({ y: -step })
      },
      {
        label: {icon: faArrowDown, transform: { rotate: -45 }},
        handleClick: () => jog({ x: step, y: -step })
      },
      {
        label: {icon: faArrowDown},
        handleClick: () => jog({ z: -step })
      }
    ], [
      {
        label: {icon: faCompressAlt, transform: { rotate: 45 }},
        handleClick: () => move({ x: 0 })
      },
      {
        label: {icon: faCompressAlt, transform: { rotate: -45 }},
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
    </>
  )
}

export default JogControl
