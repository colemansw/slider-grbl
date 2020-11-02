import React, { useEffect, useState, useContext, createContext } from 'react'
import { useLocation } from 'react-router-dom'
import { MOUNTPOINT } from '../lib/constants'

const authContext = createContext()

const parseParams = (paramStr) => {
  return paramStr.split('&').reduce((params, param) => {
    if (!param) {
      return params
    }
    let paramSplit = param.split('=').map(value => {
      return decodeURIComponent(value.replace('+', ' '))
    })
    params[paramSplit[0]] = paramSplit[1]
    return params
  }, {})
}

const storeToken = (sessionObj) => {

  const {
    state = {
      session: {}
    }
  } = JSON.parse(localStorage.getItem('cnc')) || {}

  localStorage.setItem('cnc', JSON.stringify({
    ...state,
    session: {
      ...state.session,
      ...sessionObj
    }
  }))
}

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth()
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(authContext)
}

const useProvideAuth = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [token, setToken] = useState('')
  const location = useLocation()

  const login = loc => {
    const next = encodeURI(`${MOUNTPOINT}/#${loc.pathname}`)
    window.location = `/?continue=${next}`
  }

  useEffect(() => {
    if (isFetching) return
    const params = parseParams(location.search.slice(1))
    if (params.token) {
      storeToken({ token: params.token })
      setToken(params.token)
    }
  }, [location, isFetching])

  useEffect(() => {
    if (!!token) return

    const tokenInLocalStorage = () => {
      setIsFetching(true)
      const { state: { session: { token = '' } = {} } = {} } = JSON.parse(localStorage.getItem('cnc')) || {}
      if (!!token) {
        setToken(token)
        setIsFetching(false)
        return true
      }
      return false
    }

    const fetchToken = (credentials) => {
      fetch('../api/signin', {
        method: 'POST',
        headers: {
          'ContentType': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
        .then(resp => new Promise((resolve, reject) => {
          if (resp.ok) {
            resolve(resp.json())
          } else {
            setIsFetching(false)
            reject(location)
          }
        }))
        .then(
          data => {
            storeToken(data)
            setToken(data.token)
            setIsFetching(false)
          },
          location => {
            login(location)
          }
        )
        .catch(err => console.error(err))
    }

    if (!tokenInLocalStorage()) {
      // Try logging in with no credentials
      fetchToken({ name: '', password: '' })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return {
    token,
    isFetching,
    login
  }
}