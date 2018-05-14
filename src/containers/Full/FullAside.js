import React, { Component } from 'react';
import { Input, Button, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AppSwitch } from '@coreui/react'

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router';

import * as exchangeActions from 'store/modules/exchange';
import config from 'config.json';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class FullAside extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      apikey: '8gGprOSNg8hEhAibVFalU8JjMjMB5TqNhbJqkJNpUxVMdTlzawYDnnqZ0tnKeXZn',
      secret: 'L8shsvxWJnZVaaR2PasdYfZFogs5LMLhrG3FKp3yTLg8tYjaURjaaJNijzOVt4NX',
      selectedExchange: this.props.exchangeList[0]
    };

    // this.onDismiss = this.onDismiss.bind(this);
    this.handleChangeExchange = this.handleChangeExchange.bind(this);
    this.handleBtnConnect = this.handleBtnConnect.bind(this);
    this.handleBtnDisconnect = this.handleBtnDisconnect.bind(this);
    this.handleChangeAPIKey = this.handleChangeAPIKey.bind(this);
    this.handleChangeSecret = this.handleChangeSecret.bind(this);
  }
  handleChangeExchange(e){
    this.setState({
      selectedExchange: e.target.value
    });
  }
  handleChangeAPIKey(e){
    this.setState({
      apikey: e.target.value
    })
    console.log(e.target.value)
  }
  handleChangeSecret(e){
    this.setState({
      secret: e.target.value
    })
    console.log(e.target.value)
  }
  handleBtnConnect = async() => {
    const { ExchangeActions } = this.props;
    var exchangeid = config.exchangeList[this.state.selectedExchange];

    try {
      await ExchangeActions.connectExchange({
        exchange : exchangeid,
        apikey: this.state.apikey,
        secret: this.state.secret
      })

      if(this.props.error) {
        return;
      }
    } catch (e) {
      return;
    }
  }

  handleBtnDisconnect(){
    const { ExchangeActions } = this.props;
    console.log('Disconnect Exchange Name', this.state.selectedExchange);
    var exchangeid = config.exchangeList[this.state.selectedExchange];

    ExchangeActions.disconnectExchange(exchangeid)
  }
  
  // onDismiss() {
  //   this.setState({ visible: false });
  // }

  render() {
    const { exchangeList, connectedExchanges, error } = this.props;
    const isConnected = connectedExchanges.toJS();
    console.log('exchanges', isConnected);
    const { selectedExchange } = this.state;
    const errors = error.toJS();
    console.log('error', error);

    return (
      <div className="p-3">
        <div className="mb-3">
          <h5>Exchanges</h5>
          <Input type="select" name="aside_exchange_list" id="aside_exchange_list" onChange={this.handleChangeExchange}>
          {
            exchangeList.map((ele, idx)=>{
              return <option value={ele} key={idx} >{ ele }</option>
            })
          }
          </Input>
        </div>
        <div className="mb-3">
          <h6>API Key</h6>
          <Input type="text" id="apiKey" placeholder="Enter API key" onChange={ this.handleChangeAPIKey } value={this.state.apikey} />
        </div>
        <div className="mb-3">
          <h6>Secret</h6>
          <Input type="password" id="secret" placeholder="Enter Secret" onChange={ this.handleChangeSecret } value={this.state.secret}/>
        </div>
        <div className="mb-3">
          {
            isConnected[selectedExchange] ? <Button block color="danger" type="button" onClick={ this.handleBtnDisconnect } >Disconnect</Button>
                                          : <Button block color="success" type="button" onClick={ this.handleBtnConnect } >Connect</Button>
          }
        </div>
        <div className="mb-3">
          {
            isConnected[selectedExchange] ? ( <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                                                Exchange connected!
                                              </Alert>) 
            : 
            errors.hasOwnProperty('connectExchange') ? ( <Alert color="danger">
                                                            { errors['connectExchange'] }
                                                          </Alert>)
            : ''

            
          }
        </div>
      </div>
    );
  }
}

FullAside.propTypes = propTypes;
FullAside.defaultProps = defaultProps;

export default connect(
  (state) => ({
    exchangeList: state.exchange.get('exchangeList'),
    connectedExchanges: state.exchange.get('connectedExchanges'),
    error: state.exchange.get('error'),
  }),
  (dispatch) => ({
    ExchangeActions: bindActionCreators(exchangeActions, dispatch),
  })
)(withRouter(FullAside));
