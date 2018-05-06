import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  Label,
  Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import classnames from 'classnames';
import './Preferences.css';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router';

import * as exchangeActions from 'store/modules/exchange';

class Preferences extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      sell_tg_cnt: 2,
    };

    this.toggle = this.toggle.bind(this);

    this.handleAddSellTarget = this.handleAddSellTarget.bind(this);
  }
  
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
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
                <strong>Positions</strong>
              </CardHeader>
              <CardBody>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '1' })}
                      onClick={() => { this.toggle('1'); }}
                    >
                      Manual Trades
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '2' })}
                      onClick={() => { this.toggle('2'); }}
                    >
                      Auto Trades
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <h5 className='p-2 mt-3 section-title' >Buy defaults</h5>
                    <div className='pl-2' >
                      <div className='flex-container'>
                        <div>
                          Default buy size:
                        </div>
                        <div>
                          <Input type="text" id="def_buy_size" value='0.1'/>
                        </div>
                        <div>
                          BTC equivalent
                        </div>
                      </div>

                      <div className='flex-container'>
                        <div>
                          Maximum buy size:
                        </div>
                        <div>
                          <Input type="text" id="max_buy_size" value='1.0'/>
                        </div>
                        <div>
                          BTC equivalent
                        </div>
                      </div>

                      <div className='flex-container'>
                        <div>
                          Default buy type:
                        </div>
                        <div>
                          <Input type="select" name="def_buy_type" id="def_buy_type">
                            <option value="1">Market order</option>
                            <option value="2">Limit order</option>
                          </Input>
                        </div>
                      </div>
                    </div>

                    <h5 className='p-2 mt-3 section-title' >Sell target defaults</h5>
                    <div className='pl-2' >
                      <div className='flex-container'>
                        <div>
                          Target 1:
                        </div>
                        <div>
                          At buy price plus:
                        </div>
                        <div>
                          <Input type="text" id="tg1_bpp"/>
                        </div>
                        <div>
                          sell
                        </div>
                        <div>
                          <Input type="text" id="tg1_spp"/>
                        </div>
                        <div>
                          of total buy
                        </div>
                      </div>
                      {
                        Array.apply(null, {length: sell_tg_cnt }).map(function(i, value){
                          return (<div className='flex-container' key={value+1}>
                                    <div >
                                      Target {value + 2}:
                                    </div>
                                    <div >
                                      At buy price plus:
                                    </div>
                                    <div >
                                      <Input type="text" id={"tg"+value+2+"_bpp"} />
                                    </div>
                                    <div >
                                      sell
                                    </div>
                                    <div >
                                      <Input type="text" id={"tg"+value+2+"_spp"} />
                                    </div>
                                    <div >
                                      of total buy
                                    </div>
                                    <a className="btn btn-lg" ><i className="fa fa-trash-o"></i></a>
                                  </div>)
                        })
                      }

                      <div>
                        <button type="button" className="btn btn-ghost-primary btn-sm" onClick={ this.handleAddSellTarget }>
                          <i className="fa fa-plus-circle"></i>&nbsp;Add target
                        </button>
                      </div>
                    </div>

                    <h5 className='p-2 mt-3 section-title' >Stoploss defaults</h5>
                    <div className='pl-2' >
                      <div className='flex-container'>
                        <div>
                          Default stop loss:
                        </div>
                        <div>
                          <AppSwitch className={'mx-1'} color={'primary'} outline={'alt'} label checked />
                        </div>
                        <div>
                          When price drops
                        </div>
                        <div>
                          <Input type="text" id="sl_drop" value='10'/>
                        </div>
                        <div>
                          % from buy price
                        </div>
                      </div>

                      <div className='flex-container'>
                        <div>
                          Default trailing stop:
                        </div>
                        <div>
                          <AppSwitch className={'mx-1'} color={'primary'} outline={'alt'} label />
                        </div>
                        <div>
                          When price drops
                        </div>
                        <div>
                          <Input type="text" id="ts_drop" value='10'/>
                        </div>
                        <div>
                          % from buy price
                        </div>
                        <div>
                          <Input type="select" name="ts_trigger" id="ts_trigger">
                            <option value="1">Buy/met target</option>
                            <option value="2">Highest price</option>
                          </Input>
                        </div>
                      </div>

                    </div>
                  </TabPane>
                  <TabPane tabId="2">
                    sfsdfsdfsdf
                  </TabPane>
                </TabContent>
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
)(withRouter(Preferences));
