import React from 'react'

const Keyframe = ({ keyframe, onClick, isSelected }) => {
  if (!!!keyframe) return null
  const {
    transition: {
      frames = '', interval = '', shutterSpeed = ''
    } = {},
    position: { x = '0', y = '0', z = '0' } = {}
  } = keyframe
  return (
    <tr
      onClick={onClick}
      className="text-right"
      style={isSelected ? {
        fontStyle: 'italic'
      } : {
          fontStyle: 'normal'
        }}>
      <td>{Number(x).toFixed(2)}</td>
      <td>{Number(y).toFixed(2)}</td>
      <td>{Number(z).toFixed(2)}</td>
      <td>{frames}</td>
      <td>{interval}</td>
      <td>{shutterSpeed}</td>
    </tr>
  )
}

export default Keyframe