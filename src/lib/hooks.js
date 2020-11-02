import { useEffect } from 'react'

export const useListeners = (addListener, removeListener, listeners) => {
  useEffect(() => {
      Object.keys(listeners).forEach(eventName => {
        addListener(eventName, listeners[eventName])
      })

      return () => {
        Object.keys(listeners).forEach(eventName => {
          removeListener(eventName, listeners[eventName])
        })
      }
  }, [addListener, removeListener, listeners])
}
