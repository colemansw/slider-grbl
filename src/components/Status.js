import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Keyframes from './Keyframes'
import { AXES } from '../lib/constants'

const Status = ({ status }) => {
  const { mpos, wpos, activeState } = status
  const styles = {
    bold: { fontWeight: 'bold' },
    centre: { textAlign: 'center' },
    right: { textAlign: 'right' }
  }

  const Positions = ({coords, label, prefix}) => (
    <Row>
      <Col xs={3} style={{...styles.bold, ...styles.right}}>{label}:</Col>
      {AXES.map((a, i) =>
          <Col xs={3} key={`${prefix}_${i}`} style={styles.right}>
            {coords[a]}
          </Col>
        )}
    </Row>
  )

  return (
    <>
      <Row>
        <Col style={styles.bold}>Active state:</Col>
        <Col>{activeState}</Col>
      </Row>
      <Row style={{ ...styles.bold, ...styles.centre }}>
        {['Pan(\u00b0)', 'Tilt(\u00b0)', 'Track(mm)'].map((a, i) =>
          <Col
            xs={i === 0 ? { span: 3, offset: 3 } : 3}
            key={`l_${i}`}
          >
            {a}
          </Col>
        )}
      </Row>
      <Positions coords={mpos} label={'Machine'} prefix={'m'}/>
      <Positions coords={wpos} label={'Work'} prefix={'w'}/>
      <Keyframes currentPosition={status.wpos} />
    </>
  )
}

export default Status
