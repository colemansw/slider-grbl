import React from 'react'
import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { useAuth } from '../providers/ProvideAuth'

const Navigation = () => {
  const { token } = useAuth()

  const links = [
    { to: '/control', label: 'Control' },
    { to: '/commands', label: 'Commands' }
  ]

  return (
    <Navbar bg="light" expand="sm">
      <Navbar.Brand as={Link} to="/home">Slider</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {token && (
            <>
              {links.map((l, i) => (
                <Nav.Link key={`l_${i}`} as={Link} to={l.to}>
                  {l.label}
                </Nav.Link>
              ))}
              </>
            )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
