import axios from 'axios';
var qs = require('qs');

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const getExchangeCoins = (exchange) => axios.get('/api/v1.0/coins/?exchange=' + exchange);
export const connectExchange = ({
    exchange,
    apikey,
    secret
}) => axios.post('/api/v1.0/connect', qs.stringify({
    exchange,
    apikey,
    secret
}));
export const disconnectExchange = (exchange) => axios.get('/api/v1.0/disconnect/?exchange=' + exchange);
// csrftoken = Cookies.get('csrftoken'); // Using JS Cookies library
// headers = {HTTP_X_CSRFTOKEN: csrftoken};
// axios.post(url,data,{headers: headers});

// export const checkDisplayName = (displayName) => axios.get('/api/v1.0/auth/exists/display-name/' + displayName);
// export const localRegister = ({
//   displayName,
//   email,
//   password,
//   initialMoney: { currency, index }
// }) => axios.post('/api/v1.0/auth/register/local', {
//   displayName,
//   email,
//   password,
//   initialMoney: { currency, index }
// })
// export const localLogin = ({email, password}) => axios.post('/api/v1.0/auth/login/local', {
//   email, password
// });
// export const socialLogin = ({provider, accessToken}) => axios.post('/api/v1.0/auth/login/' + provider, {
//   accessToken
// });
// export const socialRegister = ({
//   displayName,
//   provider,
//   accessToken,
//   initialMoney: { currency, index } 
// }) => axios.post('/api/v1.0/auth/register/' + provider, {
//   displayName,
//   accessToken,
//   initialMoney: { currency, index }
// });
// export const checkLoginStatus = () => axios.get('/api/v1.0/auth/check');
// export const logout = () => axios.post('/api/v1.0/auth/logout');