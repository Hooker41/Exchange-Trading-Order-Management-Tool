import { createAction, handleActions } from 'redux-actions';

import { Map, fromJS } from 'immutable';
import { pender } from 'redux-pender';

import * as ExchangeAPI from 'lib/api/exchange';
import config from 'config.json';

// action types
const SET_SYMBOLS = 'SET_SYMBOLS';
const SET_CONNECTED_EXCHANGE = 'SET_CONNECTED_EXCHANGE';
const SET_EXCHANGE_LIST = 'SET_EXCHANGE_LIST';
const CONNECT_EXCHANGE = 'CONNECT_EXCHANGE';
const DISCONNECT_EXCHANGE = 'DISCONNECT_EXCHANGE';
const SET_ERROR = 'SET_ERROR';
const GET_TICKER = 'GET_TICKER';

// action creator
export const setSymbols = createAction(SET_SYMBOLS);
export const setConnectedExchange = createAction(SET_CONNECTED_EXCHANGE);
export const setExchangeList = createAction(SET_EXCHANGE_LIST);
export const connectExchange = createAction(CONNECT_EXCHANGE, ExchangeAPI.connectExchange);
export const disconnectExchange = createAction(DISCONNECT_EXCHANGE, ExchangeAPI.disconnectExchange);
export const setError = createAction(SET_ERROR);
export const getTicker = createAction(GET_TICKER, ExchangeAPI.getTicker);

// initial state
const initialState = Map({
    connectedExchanges: Map({}),
    exchangeList:[],
    symbols: Map({}),
    marketPrice: Map({
        bid: 0,
        ask: 0,
        last: 0
    }),
    error: Map({}),
});

// reducer
export default handleActions({
    [SET_EXCHANGE_LIST]: (state, action) => {
        const { value } = action.payload;
        return state.set('exchangeList', value );
    },
    [SET_CONNECTED_EXCHANGE]: (state, action) => {
        const { name, value } = action.payload;
        return state.setIn(['connectedExchanges', name], value);
    },
    [SET_ERROR]: (state, action) => {
        return state.set('error', fromJS(action.payload));
    },
    [SET_SYMBOLS]: (state, action) => {
        const { name, value } = action.payload;
        return state.setIn(['symbols', name], value);
    },
    ...pender({
        type: CONNECT_EXCHANGE,
        onSuccess: (state, action) => {
            const exchangeId = Object.keys(action.payload.data)[0];
            const value = Object.values(action.payload.data)[0];
            const symbols = Object.values(action.payload.data)[1];
            console.log(symbols);
            const exchangeName = Object.keys(config.exchangeList).find(key => config.exchangeList[key] === exchangeId);
            
            return state.setIn(['connectedExchanges', exchangeName], value)
                        .setIn(['symbols', exchangeName], symbols)
                        .set('error', Map({}));
        },
        onFailure: (state, action) => {
            return state.set('error', Map({connectExchange: "APIKey and Secret are incorrect!"}))
        }
    }),
    ...pender({
        type: DISCONNECT_EXCHANGE,
        onSuccess: (state, action) => {
            const exchangeId = Object.keys(action.payload.data)[0];
            const value = Object.values(action.payload.data)[0];
            
            const exchangeName = Object.keys(config.exchangeList).find(key => config.exchangeList[key] === exchangeId);
            console.log('exchangeName', exchangeName);
            return state.setIn(['connectedExchanges', exchangeName], value)
                            .setIn(['symbols', exchangeName], []);
        }
    }),
    ...pender({
        type: GET_TICKER,
        onSuccess: (state, action) => {
            return state.set('marketPrice', fromJS(action.payload.data));
        }
    }),
}, initialState);
