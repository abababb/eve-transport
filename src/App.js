import React, { Component } from 'react';
import './App.css';
import { ListGroup, ListGroupItem, Panel, Grid, Row, Col } from 'react-bootstrap';

class App extends Component {
  render() {
    let routeData = {
       from: 
         { station_id: 60003760,
           solar_system: 
            { id: 30000142,
              region: 'TheForge',
              constellation: 'Kimotoro',
              solarSystem: 'Jita' } },
        to: 
         { station_id: 60008221,
           solar_system: 
            { id: 30002974,
              region: 'Devoid',
              constellation: 'Kisana',
              solarSystem: 'Mehatoor' } },
        orders: 
         [ {
             amount: 10,
             profit: '123515.90',
             buy_price: '48730.26',
             sell_price: '61596.50',
             type_name: 'J5b Enduring Warp Scrambler',
             type_volume: 5 },
           {
             amount: 100000,
             profit: '301440.00',
             buy_price: '19.25',
             sell_price: '22.39',
             type_name: 'Phased Plasma S',
             type_volume: 0.0025 },
           {
             amount: 100,
             profit: '371042.88',
             buy_price: '6379.93',
             sell_price: '10244.96',
             type_name: 'Core Scanner Probe I',
             type_volume: 0.1 },
           {
             amount: 70,
             profit: '16405657.63',
             buy_price: '209153.90',
             sell_price: '453285.71',
             type_name: '150mm Light \'Scout\' Autocannon I',
             type_volume: 5 } ],
        profit: '20417735.80',
        volume: '910.00',
        cost: '22740579.50',
        jumps: 23,
        detail: 
         [ 30000142,
           30002971,
           30002972,
           30002974 ]
    };
    let routes = [routeData].map((routeData) => <Route data={routeData} />)
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div className="App-intro">
          {routes}
        </div>
      </div>
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
            <ListGroupItem><SolarSystem solarSystemData={jump} /> </ListGroupItem>
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
            <ListGroupItem><Order orderData={order} /> </ListGroupItem>
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
        <Goods name={this.props.orderData.type_name} volume={this.props.orderData.type_volume} />
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
        <div>name: {this.props.name} </div>
        <div>volume: {this.props.volume} </div>
      </Panel>
    );
  }
}

export default App;
