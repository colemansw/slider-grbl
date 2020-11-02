import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useMessages, Message } from '../providers/ProvideMessages'

const Messages = () => {
  const { messages } = useMessages()

  return (
    <Row className="mt-2">
      <Col>
        {messages.map(
          ({ id, duration, ...message }) => (
            <Message key={id} duration={duration} {...message} />
          )
        )}
      </Col>
    </Row>
  )
}

export default Messages
