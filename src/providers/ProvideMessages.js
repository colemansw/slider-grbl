import React, {
  useState,
  useEffect,
  useContext,
  createContext
} from 'react'
import { Alert } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'

const messageContext = createContext()

export const Message = ({ variant, text, duration }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <Alert variant={variant} show={show}>
      {text}
    </Alert>
  )
}

export const ProvideMessages = ({ children }) => {
  const message = useProvideMessages()
  return (
    <messageContext.Provider value={message}>
      {children}
    </messageContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(messageContext)
}

const useProvideMessages = () => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState()

  const addMessage = ({ duration = 5000, ...msg }) => {
    setMessage(
      {
        ...msg,
        duration,
        id: uuidv4()
      },
    )
  }

  useEffect(() => {
    if (!message) return

    const removeMessage = id => {
      setMessages(messages => {
        const index = messages.findIndex(m => m.id === id)
        return ([
          ...messages.slice(0, index),
          ...messages.slice(index + 1)
        ])
      })
    }

    setMessages(messages => ([
      message,
      ...messages
    ]))

    setTimeout(() => {
      removeMessage(message.id)
    }, message.duration + 500)
  }, [message])

  return {
    messages,
    addMessage
  }
}