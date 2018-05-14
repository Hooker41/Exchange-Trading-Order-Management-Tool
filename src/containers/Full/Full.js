import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import FullAside from './FullAside';
import FullFooter from './FullFooter';
import FullHeader from './FullHeader';

import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router';

import * as exchangeActions from 'store/modules/exchange';

import { initExchange } from 'utils/exchange';

class Full extends Component {

  componentWillMount(){
    initExchange((result)=>{

      const { ExchangeActions } = this.props;
      ExchangeActions.setExchangeList({'name':'exchangeList', 'value':result.exchangeList});
      
      result.exchangeList.forEach(function(ele, idx){
        ExchangeActions.setConnectedExchange({'name':ele, 'value': false });
        ExchangeActions.setSymbols({'name':ele, 'value': [] });
      });

    });
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <FullHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />)
                      : (null);
                  },
                )}
                <Redirect from="/" to="/dashboard" />
              </Switch>
            </Container>
          </main>
          <AppAside fixed hidden>
            <FullAside />
          </AppAside>
        </div>
        <AppFooter>
          <FullFooter />
        </AppFooter>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    exchangeList: state.exchange.get('exchangeList'),
  }),
  (dispatch) => ({
    ExchangeActions: bindActionCreators(exchangeActions, dispatch),
  })
)(withRouter(Full));