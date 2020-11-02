import React from 'react'
import { Button, Col, Form, Modal } from 'react-bootstrap'
import { ErrorMessage } from '@hookform/error-message'

const ModalEditListForm = ({
  title, handleClose, onSubmit, fields, modal, errors
}) => {
  // Workaround for smooth animation on closing
  const noTrans = { transition: 'none' }

  const inputField = (field, i, j) => {
    const { label = '', ...rest } = field
    switch (field.type) {
      case 'hidden':
        return <input key={`f_${i}_${j}`} {...field} />
      case 'checkbox':
        return (
          <Form.Group as={Col} key={`f_${i}_${j}`} >
            <Form.Check {...rest} label={label} id={`${field.name}Id`} />
          </Form.Group>
        )
      default:
        return (
          <Form.Group
            as={Col}
            key={`f_${i}_${j}`}
            controlId={`${field.name}Id`}
          >
            <Form.Label>{label}</Form.Label>
            <Form.Control
              {...rest}
              isInvalid={!!errors[field.name]}
            />
            <ErrorMessage
              errors={errors}
              name={field.name}
              render={({ message }) => (
                <Form.Control.Feedback type="invalid">
                  {message}
                </Form.Control.Feedback>
              )}
            />
          </Form.Group>
        )
    }
  }

  return (
    <Modal {...modal}>
      <Modal.Header closeButton={!!handleClose}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {fields.map((row, i) => (
            <Form.Row key={`f_${i}`}>
              {row.map((field, j) => inputField(field, i, j))}
            </Form.Row>
          ))}
        </Modal.Body>
        <Modal.Footer>
          {!!handleClose && (
            <Button variant="secondary" style={noTrans} onClick={handleClose}>
              Close
            </Button>
          )}
          <Button variant="primary" type="submit" style={noTrans}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModalEditListForm