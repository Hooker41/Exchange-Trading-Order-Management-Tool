import { createAction, handleActions } from 'redux-actions';

import { Map } from 'immutable';

// action types
const SET_EXCHANGE_LIST = 'SET_EXCHANGE_LIST';


// action creator
export const setExchangeList = createAction(SET_EXCHANGE_LIST);


// initial state
const initialState = Map({
    exchangeList:[]
});

// reducer
export default handleActions({
    [SET_EXCHANGE_LIST]: (state, action) => {
        const { value } = action.payload;
        return state.set('exchangeList', value );
    },

}, initialState);