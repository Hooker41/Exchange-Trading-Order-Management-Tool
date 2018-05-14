import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Input,
  Label,
  Nav, NavItem, NavLink,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import TradingViewWidget from 'react-tradingview-widget';
import config from 'config.json';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router';

import * as exchangeActions from 'store/modules/exchange';

import './Trade.css';

class Trade extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sell_tg_cnt: 1,
      selectedExchange:'',
      selectedPair:'',
      tradingViewSymbol:'BTCUSD',
      
      buyunit:1.0,
      buytype:'last',
      buyprice: 0,
      buytotal:0,
    };

    this.getTicker = this.getTicker.bind(this);
    this.handleAddSellTarget = this.handleAddSellTarget.bind(this);
    this.handleChangeExchange = this.handleChangeExchange.bind(this);
    this.handleChangePair = this.handleChangePair.bind(this);
    this.handleChangeBuyUnit = this.handleChangeBuyUnit.bind(this);
    this.handleChangeBuyType = this.handleChangeBuyType.bind(this);
  }
  handleChangePair(e){
    const newPair = e.target.value;
    const ary = newPair.split('/');
    this.setState({
      selectedPair: e.target.value,
      tradingViewSymbol: this.state.selectedExchange + ':' + ary[0] + ary[1]
    })
  }
  
  handleChangeExchange(e){
    this.setState({
      selectedExchange: e.target.value
    });
  }
  handleAddSellTarget(){
    this.setState({
      sell_tg_cnt: this.state.sell_tg_cnt + 1
    });
  }
  handleChangeBuyUnit(e){
    this.setState({
      buyunit: e.target.value
    })

    var total = e.target.value * this.state.buyprice;
    this.setState({
      buytotal: total
    })
  }
  handleChangeBuyType(e){
    this.setState({
      buytype: e.target.value
    })
    this.getTicker(e.target.value);
  }
  componentWillMount = async() => {
    console.log('componentWillMount');
    await this.getTicker(this.state.buytype);
  }
  componentDidMount(){
    console.log('componentDidMount');
    // this.intervalId = setInterval(this.getTicker.bind(this), 1000);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }
  getTicker = async(buytype) => {
    const { selectedExchange, selectedPair } = this.state;
    const { marketPrice } = this.props;
    if(selectedPair.length > 0){
      const { ExchangeActions } = this.props;
      var exchangeid = config.exchangeList[selectedExchange];

      try {
        const result = await ExchangeActions.getTicker({
          exchange : exchangeid,
          pair: selectedPair
        })
    
        console.log('result', buytype);
        console.log(result['data'][buytype]);
        this.setState({
          buyprice: result['data'][buytype]
        })
        
      } catch (e) {
        return;
      }
    }
  }
  // getTicker = async() => {
  //   const { selectedExchange, selectedPair } = this.state;
  //   console.log('Running getTicker');
  //   if(selectedPair.length > 0){
  //     console.log('getTicker', selectedPair);
  //     const { ExchangeActions } = this.props;
  //     var exchangeid = config.exchangeList[selectedExchange];

  //     try {
  //       await ExchangeActions.getTicker({
  //         exchange : exchangeid,
  //         pair: selectedPair
  //       })
  //     } catch (e) {
  //       return;
  //     }
  //   }
  // }
  
  render() {
    const { connectedExchanges, symbols, marketPrice } = this.props;
    const { selectedExchange, sell_tg_cnt } = this.state;
    const isConnected = connectedExchanges.toJS();
    var tradingPair = symbols.toJS();
    console.log('trading pair', tradingPair);
    tradingPair = tradingPair[selectedExchange];
    console.log('selectedExchange', selectedExchange);
    console.log('trading pair', tradingPair);
    const marketData = marketPrice.toJS();
    console.log('marketData', marketData);

    var connectionExist = false;
    for (var key in isConnected) {
      if (isConnected.hasOwnProperty(key)) {
        connectionExist = connectionExist || isConnected[key];
      }
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Trade</strong>
              </CardHeader>
              <CardBody>
                <Row className='mb-3'>
                  <Col xs="3">
                    <Row>
                      <Col xs="4">
                        <Label htmlFor="omc_exchange_list">Exchanges</Label>
                      </Col>
                      <Col xs="6">
                        <Input type="select" name="omc_exchange_list" id="omc_exchange_list" onChange={this.handleChangeExchange} >
                          { !connectionExist ? <option value='NoEx' >No exchange connected</option> : 
                            <option value="">Select Exchange</option>}
                          {
                            Object.keys(isConnected).map((key, idx) => {
                              return isConnected[key] ? <option value={key} key={idx} >{key}</option> : ''
                            })
                          }
                        </Input>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs="3">
                    <Row>
                      <Col xs="5">
                        <Label htmlFor="trading_pair">Trading pair</Label>
                      </Col>
                      <Col xs="6">
                        <Input type="select" name="trading_pair" id="trading_pair" disabled = {!connectionExist } onChange={ this.handleChangePair }>
                          { tradingPair === undefined || tradingPair.length == 0 ? '':<option value="">Select Pair</option>}
                          {
                            tradingPair !== undefined ?
                              tradingPair.map((ele, idx)=>{
                                return <option value={ele}>{ele}</option>
                              }) : ''
                          }
                        </Input>
                      </Col>
                    </Row>
                  </Col>

                </Row>
                <Row className='mb-3'>
                  <Col className='chartWidget ' >
                    <TradingViewWidget symbol={this.state.tradingViewSymbol} autosize />
                  </Col>
                </Row>
                <Row className='mb-3'>

                  <Col md='4'>
                    <Card>
                      <CardHeader>
                        Buy
                      </CardHeader>
                      <CardBody>
                        <FormGroup>
                          <Label htmlFor="buy_unit">Units</Label>
                          <Input type="text" id="buy_unit" required value={this.state.buyunit} onChange={ this.handleChangeBuyUnit }/>
                        </FormGroup>
                        <FormGroup row className="my-0">
                          <Col xs="5">
                            <FormGroup>
                              <Label htmlFor="buy_type">Buy price</Label>
                              <Input type="select" id="buy_type" value={this.state.buytype} onChange={ this.handleChangeBuyType } >
                                <option value="bid">Bid</option>
                                <option value="last">Last</option>
                                <option value="ask">Ask</option>
                                <option value="limit">Limit</option>
                                <option value="market">Market</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="7">
                            <FormGroup>
                              <Label htmlFor="buy_price" >&nbsp;</Label>
                              <Input type="text" id="buy_price" value = {this.state.buyprice} disabled={this.state.buytype === 'market'}/>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="total_buy">Total buy</Label>
                          <Input type="text" id="total_buy" readOnly value={this.state.buytotal} />
                        </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md='4'>
                    <Card>
                      <CardHeader>
                        Sell targets
                        <AppSwitch className={'float-right mb-0'} label color={'info'} defaultChecked size={'sm'}/>
                      </CardHeader>
                      <CardBody>
                        <Nav vertical>
                          <NavItem>
                            <NavLink href="#">Target 1</NavLink>
                          </NavItem>
                          {
                            Array.apply(null, {length: sell_tg_cnt }).map(function(i, value){
                              return (<div className = 'del_tg_flex' key={value}>
                                        <div>
                                          <NavItem key={value+1} >
                                            <NavLink href="#">Target {value + 2} </NavLink>
                                          </NavItem>
                                        </div>
                                        <div className='icon_trash' >
                                          <a><i className="fa fa-trash-o"></i></a>
                                        </div>
                                      </div>)
                            })
                          }
                        </Nav>
                        <button type="button" className="btn btn-ghost-primary btn-sm" onClick={ this.handleAddSellTarget }>
                          <i className="fa fa-plus-circle"></i>&nbsp;Add target
                        </button>
                        <hr/>

                        <FormGroup row className="my-0">
                          <Col xs="5">
                            <FormGroup>
                              <Label htmlFor="pct_total">% Total</Label>
                              <Input type="text" id="pct_total" />
                            </FormGroup>
                          </Col>
                          <Col xs="7">
                            <FormGroup>
                              <Label htmlFor="sell_unit" >Units</Label>
                              <Input type="text" id="sell_unit"/>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                        
                        <FormGroup row className="my-0">
                          <Col xs="5">
                            <FormGroup>
                              <Label htmlFor="sell_type">Sell price</Label>
                              <Input type="select" id="sell_type">
                                <option value="market">Limit</option>
                                <option value="limit">Market</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="7">
                            <FormGroup>
                              <Label htmlFor="sell_price" >&nbsp;</Label>
                              <Input type="text" id="sell_price"/>
                            </FormGroup>
                          </Col>
                        </FormGroup>

                      </CardBody>
                    </Card>
                  </Col>

                  <Col md='4'>
                    <Card>
                      <CardHeader>
                        Stoploss
                        <AppSwitch className={'float-right mb-0'} label color={'info'} defaultChecked size={'sm'}/>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col md='6'>
                            <FormGroup row >
                              <Col md="3">
                                <Label htmlFor="sell-pct">Sell</Label>
                              </Col>
                              <Col xs="12" md="9">
                                <Input type="text" id="sell-pct" name="sell-pct" placeholder="Text" value='100%' />
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <div className='mb-3'>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="fixed-radio" name="inline-radios" value="fixed"/>
                            <Label className="form-check-label" check htmlFor="fixed-radio">Fixed</Label>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input className="form-check-input" type="radio" id="trail-radio" name="inline-radios" value="trail" />
                            <Label className="form-check-label" check htmlFor="trail-radio">Trailing</Label>
                          </FormGroup>
                        </div>
                        <Row>
                          <Col md='6'>
                            <FormGroup>
                              <Label htmlFor="pct_under_buy">% under buy</Label>
                              <Input type="text" id="pct_under_buy" required />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md='6'>
                            <FormGroup>
                              <Label htmlFor="stoploss_price">Stoploss price</Label>
                              <Input type="text" id="stoploss_price" required />
                            </FormGroup>
                          </Col>
                        </Row>

                      </CardBody>
                    </Card>
                  </Col>

                </Row>

                <div className='btn_trade'>
                  <button type="button" className="btn btn-success btn-lg" onClick={ this.handleTrade }>
                    Place / Update Trade
                  </button>
                </div>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    connectedExchanges: state.exchange.get('connectedExchanges'),
    symbols: state.exchange.get('symbols'),
    marketPrice: state.exchange.get('marketPrice'),
  }),
  (dispatch) => ({
    ExchangeActions: bindActionCreators(exchangeActions, dispatch),
  })
)(withRouter(Trade));
