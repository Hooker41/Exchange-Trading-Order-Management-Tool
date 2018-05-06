import { createAction, handleActions } from 'redux-actions';

import { Map, fromJS } from 'immutable';
import { pender } from 'redux-pender';

import * as ExchangeAPI from 'lib/api/exchange';

// action types
const GET_EXCHANGE_COINS = 'GET_EXCHANGE_COINS';
const SET_CONNECTED_EXCHANGE = 'SET_CONNECTED_EXCHANGE';
const SET_EXCHANGE_LIST = 'SET_EXCHANGE_LIST';
const CONNECT_EXCHANGE = 'CONNECT_EXCHANGE';
const DISCONNECT_EXCHANGE = 'DISCONNECT_EXCHANGE';
const SET_ERROR = 'SET_ERROR';

// action creator
export const getExchangeCoins = createAction(GET_EXCHANGE_COINS, ExchangeAPI.getExchangeCoins);
export const setConnectedExchange = createAction(SET_CONNECTED_EXCHANGE);
export const setExchangeList = createAction(SET_EXCHANGE_LIST);
export const connectExchange = createAction(CONNECT_EXCHANGE, ExchangeAPI.connectExchange);
export const disconnectExchange = createAction(DISCONNECT_EXCHANGE, ExchangeAPI.disconnectExchange);
export const setError = createAction(SET_ERROR);

// initial state
const initialState = Map({
    exchangeCoins: [],
    connectedExchanges: Map({}),
    exchangeList:[],
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
    ...pender({
        type: GET_EXCHANGE_COINS,
        onSuccess: (state, action) => {
            const { coins } = action.payload.data;
            console.log('Exchange Coins',action.payload);

            return state.set('exchangeCoins', coins );
        }
    }),
    ...pender({
        type: CONNECT_EXCHANGE,
        onSuccess: (state, action) => {
            const name = Object.keys(action.payload.data)[0];
            const value = Object.values(action.payload.data)[0];

            return state.setIn(['connectedExchanges', name], value)
                        .set('error', Map({}));
        },
        onFailure: (state, action) => {
            return state.set('error', Map({connectExchange: "APIKey and Secret are incorrect!"}))
        }
    }),
    ...pender({
        type: DISCONNECT_EXCHANGE,
        onSuccess: (state, action) => {
            const name = Object.keys(action.payload.data)[0];
            const value = Object.values(action.payload.data)[0];
            
            return state.setIn(['connectedExchanges', name], value);
        }
    }),
}, initialState);
