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

class CalculateStation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marketData: []
    };
  }

  componentDidMount() {
    let regionID = '10000043'
    let page = 1
    let host = 'https://esi.tech.ccp.is/latest'
    let station = '60008494'
    let orderData = []

    let fetchNextPage = (endFetch) => {
      let api = '/markets/' + regionID + '/orders/?datasource=tranquility&order_type=all&page=' + page
      let url = host + api
      fetch(url).then(results => results.json())
        .then(marketData => {
          if (marketData.length) {
            orderData = orderData.concat(marketData)
            console.log('第' + page + '页数据获取成功')
            page++
            fetchNextPage(endFetch)
          } else {
            endFetch(orderData)
          }
        })
    }

    fetchNextPage(orderData => {
      // 拿到所有订单分类处理
      orderData = orderData
        .filter(order => order.location_id === parseInt(station, 10))
        .reduce((typeOrders, order) => {
          if (typeof typeOrders[order.type_id] === 'undefined') {
            typeOrders[order.type_id] = {
              borders: [],
              sorders: [],
              hbuy: 0,
              lsell: 0,
            };
          }
          if (order.is_buy_order) {
            typeOrders[order.type_id].borders.push(order);
            if (order.price > typeOrders[order.type_id].hbuy) {
              typeOrders[order.type_id].hbuy = order.price
            }
          } else {
            typeOrders[order.type_id].sorders.push(order);
            if (typeOrders[order.type_id].lsell === 0 || order.price < typeOrders[order.type_id].lsell) {
              typeOrders[order.type_id].lsell = order.price
            }
          }
          return typeOrders
        }, {})

      // 订单类型obj变为数组
      let orderArr = []
      for (const type in orderData) {
        if (orderData.hasOwnProperty(type)) {
          orderData[type].type_id = type
          orderArr.push(
            orderData[type]
          )
        }
      }

      // 过滤有价值商品, 利润/成本比例限制(rateLimit), 买单量限制(bOrderLimit)
      
      const rateLimit = 100
      const bOrderLimit = 5
      let typeArr = []
      orderArr = orderArr.filter(typeOrder => {
        return typeOrder.hbuy > 0 && (typeOrder.lsell - typeOrder.hbuy) / typeOrder.hbuy > rateLimit && typeOrder.borders.length > bOrderLimit
      }).map(typeOrder => {
        typeArr.push(typeOrder.type_id)
        typeOrder.profit_rate = (typeOrder.lsell - typeOrder.hbuy) / typeOrder.hbuy
        return typeOrder
      })

      // 获取商品名称
      let api = '/universe/names/'
      let url = host + api
      fetch(url, {
        method: 'post',
        body: JSON.stringify(typeArr)
      }).then(res => res.json())
        .then(typeNames => {
          typeNames = typeNames.reduce((typeNameDict, typeName) => {
            typeNameDict[typeName.id] = typeName.name
            return typeNameDict
          }, {})
          orderArr.map(typeOrder => {
            typeOrder.type_name = typeNames[typeOrder.type_id]
            return typeOrder
          })

          // 获取商品均价
          let api = '/markets/prices/'
          let url = host + api
          fetch(url).then(res => res.json())
            .then(typePrices => {
              typePrices = typePrices.reduce((typePriceDict, typePrice) => {
                typePriceDict[typePrice.type_id] = typePrice
                return typePriceDict
              }, {})

              orderArr = orderArr.map(typeOrder => {
                typeOrder.type_avg_price = 0
                typeOrder.type_adjusted_price = 0
                if (typePrices[typeOrder.type_id]) {
                  typeOrder.type_avg_price = typePrices[typeOrder.type_id].average_price
                  typeOrder.type_adjusted_price = typePrices[typeOrder.type_id].adjusted_price
                }
                return typeOrder
              }).sort((type1, type2) => (type1.profit_rate > type2.profit_rate))
              console.log(orderArr)

              // 设置展示数据
              this.setState({
                marketData: orderArr
              })
            })
        })
    })
  }

  render() {
    return (
      <div>
      {
        this.state.marketData.map((order) =>
          <Order key={order.type_id} orderData={order} /> 
        )
      }
      </div>
    );
  }
}

class Order extends React.Component {
  render() {
    let order = this.props.orderData
    return (
      <Panel collapsible header={order.type_name}>
        <Table bordered hover>
          <tbody>
            <tr>
              <td style={ColLabelWidth()}>average price</td>
              <td>{parseInt(order.type_avg_price, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>ajusted price</td>
              <td>{parseInt(order.type_adjusted_price, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>highest buy</td>
              <td style={Red()}>{parseInt(order.hbuy, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>lowest sell</td>
              <td style={Green()}>{parseInt(order.lsell, 10).toLocaleString()}</td>
            </tr>
            <tr>
              <td style={ColLabelWidth()}>profit_rate</td>
              <td style={Green()}>{order.profit_rate.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
      </Panel>
    );
  }
}

export default CalculateStation
