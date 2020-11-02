import React, { useState, useEffect } from 'react'
import {
  Button,
  Col,
  Row,
  ListGroup,
  ButtonGroup
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faRunning,
  faEdit,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { useAuth } from '../providers/ProvideAuth'
import { useMessages } from '../providers/ProvideMessages'
import ModalEditListForm from './ModalEditListForm'

const API = '../api/commands'

const EditCommand = ({ show, current, onSubmit, handleClose }) => {
  const { id = null, enabled = true, title = '', commands = '' } = current || {}
  const { errors, register, handleSubmit } = useForm()

  const inputs = [[
    {
      type: "hidden",
      name: "id",
      ref: register,
      defaultValue: id
    },
    {
      label: 'Title',
      name: 'title',
      ref: register({
        required: 'Title is required'
      }),
      defaultValue: title
    },
    {
      label: 'Command',
      name: 'commands',
      ref: register({
        required: 'Commands are required'
      }),
      defaultValue: commands
    }],
  [{
    label: 'Enabled',
    type: 'checkbox',
    name: 'enabled',
    ref: register,
    defaultChecked: enabled,
  }]
  ]

  return (
    <ModalEditListForm
      title={`${!!current ? 'Edit' : 'New'} command`}
      handleClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      fields={inputs}
      modal={{ show, onHide: handleClose }}
      errors={errors}
    />
  )
}

const Commands = () => {
  const [commands, setCommands] = useState([])
  const [show, setShow] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const { token } = useAuth()
  const { addMessage } = useMessages()

  const getCommands = (query) => {
    fetch(`${API}${query}`, {
      method: 'GET'
    })
      .then(resp => resp.json())
      .then(data => {
        setCommands(data.records)
      })
      .catch(err => console.error(err))
  }

  const runCommand = (e) => {
    const { currentTarget: target } = e
    target.blur()
    fetch(`${API}/run/${selectedId}?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(resp => resp.json())
      .then(data => addMessage({
        variant: 'success',
        text: `Running task: ${data.taskId}`
      }))
      .catch(err => console.error(err))
  }

  const createCommand = (options) => {
    const { id, ...rest } = options
    fetch(`${API}?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...rest })
    })
      .then(resp => resp.ok)
      .then(ok => {
        if (!ok) return
        getCommands(`?token=${token}`)
        setShow(false)
        setSelectedId(null)
      })
      .catch(err => console.error(err))
  }

  const updateCommand = (options) => {
    const { id, ...rest } = options
    fetch(`${API}/${id}?token=${token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...rest })
    })
      .then(resp => resp.ok)
      .then(ok => {
        if (!ok) return
        getCommands(`?token=${token}`)
        setShow(false)
        setSelectedId(null)
      })
      .catch(err => console.error(err))
  }

  const deleteCommand = (e) => {
    const { currentTarget: target } = e
    target.blur()
    fetch(`${API}/${selectedId}?token=${token}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(resp => resp.ok)
      .then(ok => {
        if (!ok) return
        getCommands(`?token=${token}`)
        setShow(false)
        setSelectedId(null)
      })
      .catch(err => console.error(err))
  }

  const getCommand = id => {
    return commands.find(c => c.id === id)
  }

  useEffect(() => {
    if (token) {
      getCommands(`?token=${token}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const buttons = [
    {
      variant: 'primary',
      onClick: (e) => {
        const { currentTarget: target } = e
        target.blur()
        setSelectedId(null)
        setShow(true)
      },
      label: { icon: faPlus }
    },
    {
      disabled: selectedId === null || getCommand(selectedId).enabled === false,
      variant: 'warning',
      onClick: runCommand,
      label: { icon: faRunning }
    },
    {
      disabled: selectedId === null,
      variant: 'secondary',
      onClick: (e) => {
        const { currentTarget: target } = e
        target.blur()
        setShow(true)
      },
      label: { icon: faEdit }
    },
    {
      disabled: selectedId === null,
      variant: 'danger',
      onClick: deleteCommand,
      label: { icon: faTrash }
    }
  ]

  if (token) {
    return (
      <>
        <Row>
          <Col>
            <h2 className="text-center">Commands</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 6, offset: 2 }}>
            <ListGroup className="mb-2">
              {commands.map((c) => (
                <ListGroup.Item
                  key={`k_${c.id}`}
                  onClick={() => setSelectedId(c.id)}
                  active={selectedId === c.id}
                >
                  {c.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col xs={2}>
            <ButtonGroup vertical>
              {buttons.map((button, index) => {
                const { label, ...rest } = button
                return (
                  <Button {...rest} key={`b_${index}`}>
                    <FontAwesomeIcon {...label} />
                  </Button>
                )
              })}
            </ButtonGroup>
          </Col>
        </Row>
        <EditCommand
          show={show}
          current={selectedId !== null ? getCommand(selectedId) : null}
          onSubmit={selectedId === null ? createCommand : updateCommand}
          handleClose={() => setShow(false)}
        />
      </>
    )
  } else {
    return (
      <h4>Token not available...</h4>
    )
  }
}

export default Commands
