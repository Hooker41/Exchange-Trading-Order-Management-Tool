import config from 'config.json';

export const initExchange = (callback) => {

    var exchangelist = [];
    var exchangeObj = config.exchangeList;
    for (var key in exchangeObj) {
        if (exchangeObj.hasOwnProperty(key)) {
            exchangelist.push(key);
        }
    }

    callback({
        exchangeList: exchangelist
    })

}