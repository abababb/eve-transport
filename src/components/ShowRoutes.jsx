import React, { Component } from 'react';
import { 
  ListGroup, ListGroupItem, Panel, Grid, Row, Col,
  FormGroup, ControlLabel, FormControl, Table
} from 'react-bootstrap';

function Green () {
  return {
    color: 'green',
    bold: true
  }
}

function Red () {
  return {
    color: 'red',
    bold: true
  }
}

function ColLabelWidth () {
  return {
    width: '15%'
  }
}

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
    );
  }
}

class Route extends React.Component {
  render() {
    let solarSystemFrom = this.props.data.from.solar_system
    let solarSystemTo = this.props.data.to.solar_system
    let header = solarSystemFrom.region + '.' + solarSystemFrom.solarSystem + '.' + this.props.data.from.station_id
      + ' -> ' + solarSystemTo.region + '.' + solarSystemTo.solarSystem + '.' + this.props.data.to.station_id
      + '    (' + this.props.data.jumps + ')'
    ;
    return (
      <Panel collapsible header={header}>
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
      <div>
        <Table bordered hover>
          <tbody>
            <tr>
              <td style={ColLabelWidth()}>profit</td>
              <td style={Green()}>{parseInt(this.props.data.profit, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>cost</td>
              <td style={Red()}>{parseInt(this.props.data.cost, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>volume</td>
              <td>{this.props.data.volume}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

class OrderList extends React.Component {
  render() {
    let header = 'Orders: ' + this.props.orders.length;
    return (
      <Panel collapsible header={header}>
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
        <Table bordered hover>
          <tbody>
            <tr>
              <td style={ColLabelWidth()}>amount</td>
              <td>{this.props.orderData.amount}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>buy</td>
              <td style={Red()}>{parseInt(this.props.orderData.buy_price, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>sell</td>
              <td style={Green()}>{parseInt(this.props.orderData.sell_price, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>profit</td>
              <td style={Green()}>{parseInt(this.props.orderData.profit, 10).toLocaleString()}</td>
            </tr>
          </tbody>
        </Table>
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
