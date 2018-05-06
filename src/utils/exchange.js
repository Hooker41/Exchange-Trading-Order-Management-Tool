import config from 'config.json';

export const initExchange = (callback) => {

    callback({
        exchangeList: config.exchangeList
    })

}