import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  Label
} from 'reactstrap';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router';

import * as exchangeActions from 'store/modules/exchange';

class Positions extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { connectedExchanges } = this.props;
    const isConnected = connectedExchanges.toJS();
    
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Positions</strong>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="3">
                    <Row>
                      <Col xs="4">
                        <Label htmlFor="omc_exchange_list">Exchanges</Label>
                      </Col>
                      <Col xs="6">
                        <Input type="select" name="omc_exchange_list" id="omc_exchange_list">
                          <option value='All'>All Exchanges</option>
                          {
                            Object.keys(isConnected).map((key, idx) => {
                              return isConnected[key] ? <option value={key} key={idx} >{key}</option> : ''
                            })
                          }
                        </Input>
                      </Col>
                    </Row>
                  </Col>
                </Row>
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
)(withRouter(Positions));
