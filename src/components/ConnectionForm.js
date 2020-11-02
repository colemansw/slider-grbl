import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDoorOpen,
  faDoorClosed
} from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import { useController } from '../providers/ProvideController'
import { useListeners } from '../lib/hooks'
import { blurClick } from '../lib/utils'

const ConnectionForm = () => {
  const {
    connected,
    closePort,
    openPort,
    listPorts,
    port,
    ports,
    loadedControllers,
    addListener,
    removeListener,
    baudrates,
    type,
    baudrate
  } = useController()

  const [allPorts, setAllPorts] = useState([])
  const { register, handleSubmit } = useForm({
    defaultValues: {
      type: type || Cookies.get('cnc.controllerType'),
      port: port || Cookies.get('cnc.port'),
      baudrate: baudrate || Cookies.get('cnc.baudrate')
    }
  })

  const handleClosePort = () => {
    closePort(port)
  }

  const handleOpenPort = (data, e) => {
    const { nativeEvent: submit } = e
    openPort(data.port, {
      controllerType: data.type,
      baudrate: Number(data.baudrate)
    })
    setTimeout(() => submit.submitter.blur(), 500)
  }

  useListeners(addListener, removeListener, {
    'serialport:list': portList => setAllPorts([
      ...new Set([
        ...portList.map(p => p.port),
        ...ports
      ])
    ])
  })

  useEffect(() => {
    if (allPorts.length === 0) {
      listPorts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const baudRates = [
    ...new Set([...baudrates, 115200])
  ].sort((a, b) => b - a)

  const formGroups = [
    { label: 'Type', options: loadedControllers, name: 'type' },
    { label: 'Port', options: allPorts, name: 'port' },
    { label: 'Baud rate', options: baudRates, name: 'baudrate' }
  ]
  if (loadedControllers.length === 0 || allPorts.length === 0 || baudRates.length === 0) {
    return <p>Loading connection options...</p>
  }
  return (
    <>
      <Form onSubmit={handleSubmit(handleOpenPort)}>
        <fieldset disabled={!connected || !!port}>
          {formGroups.map((g, i) => (
            <Form.Group key={`g_${i}`} controlId={`form${g.label.replace(' ', '_')}`}>
              <Form.Label>{g.label}</Form.Label>
              <Form.Control
                as="select"
                name={g.name}
                disabled={!connected || !!port}
                ref={register}
              >
                {g.options.map((o, j) =>
                  <option key={`o_${i}_${j}`}>{o}</option>
                )}
              </Form.Control>
            </Form.Group>
          ))}
          {!port && (
            <Button
              className="btn-block"
              variant="primary"
              type="submit"
              title="Open port"
            >
              <FontAwesomeIcon icon={faDoorOpen} />
            </Button>
          )}
        </fieldset>
      </Form>
      {!!port && (
        <>
          <Button
            className="btn-block"
            variant="warning"
            onClick={(e) => blurClick(handleClosePort, e)}
            title="Close port"
          >
            <FontAwesomeIcon icon={faDoorClosed} />
          </Button>

        </>
      )}
    </>
  )
}

export default ConnectionForm