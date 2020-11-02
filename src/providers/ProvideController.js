import React, {
  useEffect,
  useState,
  useContext,
  createContext
} from 'react'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import Controller from 'cncjs-controller'
import Cookies from 'js-cookie'
import { useAuth } from '../providers/ProvideAuth'
import { useMessages } from './ProvideMessages'
import { useListeners } from '../lib/hooks'
import { HOST } from '../lib/constants'
import { parsePosition, toNumbers } from '../lib/utils'

const controller = new Controller(io)

const controllerContext = createContext(controller)

export const ProvideController = ({ children }) => {
  const controller = useProvideController()
  return (
    <controllerContext.Provider value={controller}>
      {children}
    </controllerContext.Provider>
  )
}

export const useController = () => {
  return useContext(controllerContext)
}

const useProvideController = () => {
  const { addMessage } = useMessages()
  const [hasChanged, setHasChanged] = useState(false)
  const [keyframes, setKeyframes] = useState([])
  const [isOk, setIsOk] = useState(true)
  const { token, login } = useAuth()
  const location = useLocation()

  const jog = (position, move = false, feed = 200) => {
    const asNumbers = toNumbers(position)
    controller.writeln(`$J=${move ? '' : 'G91 '}${parsePosition(asNumbers)} F${feed}`)
  }

  const move = position => {
    jog(position, true)
  }

  const jogCancel = () => {
    controller.write(String.fromCharCode(0x85))
  }

  useEffect(() => {
    if (hasChanged) {
      setHasChanged(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChanged])

  useEffect(() => {
    if (token) {
      const options = {
        query: `token=${token}`
      }
      controller.connect(HOST, options)
    }

    return () => controller.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useListeners(
    controller.addListener.bind(controller),
    controller.removeListener.bind(controller),
    {
      'serialport:open': ({ baudrate, controllerType, port }) => {
        const text = `Connected to ${controllerType} on port ${port} at ${baudrate} baud.`
        addMessage({ variant: 'success', text: text })
        setHasChanged(true)
        Cookies.set('cnc.controllerType', controllerType, { expires: 365 })
        Cookies.set('cnc.port', port, { expires: 365 })
        Cookies.set('cnc.baudrate', baudrate, { expires: 365 })
      },
      'serialport:close': ({ port }) => {
        addMessage({ variant: 'success', text: `Port ${port} has closed.` })
        setHasChanged(true)
      },
      'connect': () => {
        setHasChanged(true)
        addMessage({ variant: 'success', text: 'Socket connected.' })
      },
      'error': () => {
        controller.socket.destroy()
        login(location)
      },
      'disconnect': () => {
        setHasChanged(true)
        addMessage({ variant: 'warning', text: 'Socket disconnected.' })
      },
      'serialport:read': data => {
        if (data.includes('ok')) setIsOk(true)
      },
      'startup': () => setHasChanged(true),
      'controller:state': () => setHasChanged(true),
      'serialport:error': err => addMessage({ variant: 'danger', text: `Could not open port ${err.port}.` })
    }
  )

  return {
    connected: controller.connected,
    state: controller.state,
    port: controller.port,
    ports: controller.ports,
    baudrates: controller.baudrates,
    type: controller.type,
    controllerCommand: controller.command.bind(controller),
    closePort: controller.closePort.bind(controller),
    openPort: controller.openPort.bind(controller),
    listPorts: controller.listPorts.bind(controller),
    loadedControllers: controller.loadedControllers,
    addListener: controller.addListener.bind(controller),
    removeListener: controller.removeListener.bind(controller),
    keyframes,
    setKeyframes,
    jog,
    move,
    jogCancel,
    setIsOk,
    isOk
  }
}