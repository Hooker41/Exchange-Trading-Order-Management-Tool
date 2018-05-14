from django.shortcuts import render
from django.views.generic import TemplateView

from django.http import HttpResponse, JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
import ccxt


# Create your views here.

def getExchanges(request):
    exchangeName = request.GET["exchange"]
    print(exchangeName)
    exchanges = ccxt.exchanges
    res = {
        'exchanges' : exchanges
    }
    return JsonResponse(res)

exchangeIns = {}
def connectExchange(request):

    exchangeName = request.POST['exchange']
    apikey = request.POST['apikey']
    secret = request.POST['secret']

    exchangeIns[exchangeName] = eval ('ccxt.%s ()' % exchangeName)
    
    exchangeIns[exchangeName].apiKey = apikey
    exchangeIns[exchangeName].secret = secret

    try:
        balance = exchangeIns[exchangeName].fetch_balance()
    except Exception as e:
        return HttpResponseBadRequest()
    try:
        symbols = exchangeIns[exchangeName].symbols
        btcSymbols = [k for k in symbols if 'BTC' in k]
    except Exception as e:
        return HttpResponseBadRequest()
    
    return JsonResponse({exchangeName: True, 'symbol': btcSymbols})

def disconnectExchange(request):

    exchangeName = request.GET['exchange']
    del exchangeIns[exchangeName]
    
    return JsonResponse({exchangeName: False})

def getTicker(request):

    exchangeName = request.POST['exchange']
    pair = request.POST['pair']

    if exchangeIns[exchangeName]:
        exchange = exchangeIns[exchangeName]
        ticker = exchange.fetch_ticker(pair)
        return JsonResponse({ 'bid': ticker['bid'], 'ask': ticker['ask'], 'last': ticker['last'] })
    else:
        return HttpResponseBadRequest()
