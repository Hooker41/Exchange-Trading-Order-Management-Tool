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
    };

    this.handleAddSellTarget = this.handleAddSellTarget.bind(this);
  }
  
  handleAddSellTarget(){
    this.setState({
      sell_tg_cnt: this.state.sell_tg_cnt + 1
    });
  }

  render() {
    const { connectedExchanges } = this.props;
    const isConnected = connectedExchanges.toJS();
    const sell_tg_cnt = this.state.sell_tg_cnt;

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
                        <Input type="select" name="omc_exchange_list" id="omc_exchange_list" >
                          { Object.keys(isConnected).length == 0 ? <option>{'No exchange conneced'}</option> : 
                          
                            Object.keys(isConnected).map((key, idx) => {
                              return isConnected[key] ? <option value={key} key={idx} >{key}</option> : ''
                            })
                          }
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className='mb-3'>
                  <Col className='chartWidget ' >
                    <TradingViewWidget symbol="COINBASE:BTCUSD" autosize />
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
                          <Input type="text" id="buy_unit" required />
                        </FormGroup>
                        <FormGroup row className="my-0">
                          <Col xs="5">
                            <FormGroup>
                              <Label htmlFor="buy_type">Buy price</Label>
                              <Input type="select" id="buy_type">
                                <option value="market">Limit</option>
                                <option value="limit">Market</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="7">
                            <FormGroup>
                              <Label htmlFor="buy_price" >&nbsp;</Label>
                              <Input type="text" id="buy_price"/>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="total_buy">Total buy</Label>
                          <Input type="text" id="total_buy" required />
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
  }),
  (dispatch) => ({
    ExchangeActions: bindActionCreators(exchangeActions, dispatch),
  })
)(withRouter(Trade));
