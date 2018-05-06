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
        return JsonResponse({exchangeName: True})
    except Exception as e:
        return HttpResponseBadRequest()

    # if( exchangeIns[exchangeName] ):
    #     return JsonResponse({exchangeName: True})
    # else:
    #     return HttpResponseForbidden()

def disconnectExchange(request):

    exchangeName = request.GET['exchange']
    del exchangeIns[exchangeName]
    
    return JsonResponse({exchangeName: False})