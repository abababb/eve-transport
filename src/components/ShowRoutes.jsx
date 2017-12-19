import React, { Component } from 'react';
import { 
  ListGroup, ListGroupItem, Panel, Grid, Row, Col,
  FormGroup, ControlLabel, FormControl, HelpBlock
} from 'react-bootstrap';

class ShowRoutes extends Component {
  constructor() {
    super();
    this.state = {
      routeData: [],
      station: ''
    }
    this.handleStationChange = this.handleStationChange.bind(this);
  }

  handleStationChange (station) {
    let api = 'http://localhost:8989/station/routes/'
    if (station === 'all' || station.length === 8) {
      api = api + station;
      fetch(api).then(results => results.json())
        .then(routeData => {
          this.setState({
            routeData: routeData,
            station: station
          })
        })
    } else {
      this.setState({
        routeData: [],
        station: station
      })
    }
  }

  render() {
    document.title = 'getRoutes'

    let routes = this.state.routeData.map((routeData) => {
      let key = routeData.from.station_id + 'to' + routeData.to.station_id
      return <Route key={key} data={routeData} />
    })
    return (
      <Panel>
        <SearchStation station={this.state.station} onStationChange={this.handleStationChange}/>
        {routes}
      </Panel>
    );
  }
}

class SearchStation extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onStationChange(e.target.value);
  }

  render() {
    let station = this.props.station
    return (
      <form>
        <FormGroup
          controlId="station"
        >
          <ControlLabel>Enter Station ID:</ControlLabel>
          <FormControl
            type="text"
            value={station}
            onChange={this.handleChange}
          />
        </FormGroup>
      </form>
    );
  }
}

class Station extends React.Component {
  render() {
    return (
      <Panel collapsible defaultExpanded header={this.props.label} >
        <div>{this.props.stationData.station_id}</div>
        <div>{this.props.stationData.solar_system.region}</div>
        <div>{this.props.stationData.solar_system.constellation}</div>
        <div>{this.props.stationData.solar_system.solarSystem}</div>
      </Panel>
    );
  }
}

class StationPair extends React.Component {
  render() {
    return (
      <Panel>
        <Station stationData={this.props.from} label="From" />
        <Station stationData={this.props.to} label="To" />
      </Panel>
    );
  }
}

class Route extends React.Component {
  render() {
    return (
      <Panel collapsible defaultExpanded header="Route Detail">
        <Grid>
          <Row>
            <Col xs={12} md={6}><RouteSummary data={this.props.data} /></Col>
            <Col xs={12} md={6}><OrderList orders={this.props.data.orders} /></Col>
          </Row>
        </Grid> 
      </Panel>
    );
  }
}

class RouteSummary extends React.Component {
  render() {
    return (
      <Panel collapsible defaultExpanded header="Summary">
        <Panel>
          <div>profit: {this.props.data.profit}</div>
          <div>volume: {this.props.data.volume}</div>
          <div>cost: {this.props.data.cost}</div>
          <div>jumps: {this.props.data.jumps}</div>
        </Panel>
        <StationPair from={this.props.data.from} to={this.props.data.to} />
        <JumpDetail jumps={this.props.data.detail} />
      </Panel>
    );
  }
}

class JumpDetail extends React.Component {
  render() {
    if (!this.props.jumps) {
      return null
    }
    return (
      <Panel collapsible defaultExpanded header="Jumps Detail">
        <ListGroup fill>
        {
          this.props.jumps.map((jump) =>
            <ListGroupItem key={jump} >
              <SolarSystem solarSystemData={jump} />
            </ListGroupItem>
          )
        }
        </ListGroup>
      </Panel>
    );
  }
}

class SolarSystem extends React.Component {
  render() {
    return (
      <div>{this.props.solarSystemData}</div>
    );
  }
}

class OrderList extends React.Component {
  render() {
    return (
      <Panel collapsible defaultExpanded header="Order list">
        <ListGroup fill>
        {
          this.props.orders.map((order) =>
            <ListGroupItem key={order.type.id}>
              <Order orderData={order} /> 
            </ListGroupItem>
          )
        }
        </ListGroup>
      </Panel>
    );
  }
}

class Order extends React.Component {
  render() {
    return (
      <div>
        <Goods typeData={this.props.orderData.type} />
        <div>amount: {this.props.orderData.amount} </div>
        <div>profit: {this.props.orderData.profit} </div>
        <div>buy: {this.props.orderData.buy_price} </div>
        <div>sell: {this.props.orderData.sell_price} </div>
      </div>
    );
  }
}

class Goods extends React.Component {
  render() {
    return (
      <Panel>
        <div>name: {this.props.typeData.name} </div>
        <div>volume: {this.props.typeData.volume} </div>
      </Panel>
    );
  }
}

export default ShowRoutes
