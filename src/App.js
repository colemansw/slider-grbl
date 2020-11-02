import React from 'react'
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation
} from 'react-router-dom'
import {
  Col,
  Container,
  Row
} from 'react-bootstrap'
import Messages from './components/Messages'
import HomePage from './components/HomePage'
import Navigation from './components/Navigation'
import Control from './components/Slider'
import Commands from './components/Commands'
import { ProvideAuth } from './providers/ProvideAuth'
import { ProvideMessages } from './providers/ProvideMessages'
import { ProvideController } from './providers/ProvideController'

const NoMatch = () => {
  const location = useLocation()
  return (
    <Row>
      <Col xs={{ span: 6, offset: 3 }}>
        <h2 className="text-center">Whoops!</h2>
        <h4>Sorry, we can't find page <code>{location.pathname}</code> on this server.</h4>
      </Col>
    </Row>
  )
}

function App() {
  return (
    <Container fluid>
      <ProvideMessages>
        <Router >
          <ProvideAuth>
            <ProvideController>
              <Navigation />
              <Switch>
                <Redirect exact from="/" to="/control" />
                <Route path="/home">
                  <HomePage />
                </Route>
                <Route exact path="/control">
                  <Control />
                </Route>
                <Route exact path="/commands">
                  <Commands />
                </Route>
                <Route path="*" component={NoMatch} />
              </Switch>
              <Messages />
            </ProvideController>
          </ProvideAuth>
        </Router>
      </ProvideMessages>
    </Container>
  )
}

export default App
