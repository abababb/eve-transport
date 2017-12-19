import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import ShowRoutes from './components/ShowRoutes'
import CalculateStation from './components/CalculateStation'

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Route path="/routes" component={ShowRoutes}/>
            <Route path="/station" component={CalculateStation}/>
          </div>
        </Router>
    );
  }
}

export default App;
