from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required


####################################################################################################
# Local import
####################################################################################################


####################################################################################################
# Parameters
####################################################################################################


####################################################################################################
# Definitions
####################################################################################################


####################################################################################################
# Route definitions
####################################################################################################


@login_required(login_url=settings.LOGIN_URL)
def dashboard_graph(request):

    if 'head-unit' in request.GET['machine']:
        Results_Formatted = [
            {
                'time': '2019/09/15 08:56:10',
                'download': 100,
                'upload': 50,
            },
            {
                'time': '2019/09/15 08:57:10',
                'download': 90,
                'upload': 50,
            },
            {
                'time': '2019/09/15 08:58:10',
                'download': 50,
                'upload': 55,
            },
            {
                'time': '2019/09/15 08:59:10',
                'download': 10,
                'upload': 50,
            },
        ]

    else:
        Results_Formatted = [
            {
                'time': '2019/09/15 08:56:10',
                'tcp_sent': 10,
                'tcp_received': 50,
            },
            {
                'time': '2019/09/15 08:57:10',
                'tcp_sent': 50,
                'tcp_received': 55,
            },
            {
                'time': '2019/09/15 08:58:10',
                'tcp_sent': 90,
                'tcp_received': 50,
            },
            {
                'time': '2019/09/15 08:59:10',
                'tcp_sent': 100,
                'tcp_received': 50,
            },
            {
                'time': '2019/09/15 09:00:10',
                'tcp_sent': 150,
                'tcp_received': 75,
            }
        ]

    return JsonResponse(Results_Formatted, safe=False)


@login_required(login_url=settings.LOGIN_URL)
def dashboard_analyzers(_):

    Results_Formatted = [
        {
            'analyzer': 'analyzer-0001',
            'last_update': '2019/09/15 08:56:10',
            'tcp_sent': 100,
            'tcp_received': 50,
            'udp': 10,
        },
        {
            'analyzer': 'analyzer-0002',
            'last_update': '2019/09/15 08:56:10',
            'tcp_sent': 50,
            'tcp_received': 50,
            'udp': 10,
        },
        {
            'analyzer': 'analyzer-0003',
            'last_update': '2019/09/15 08:56:10',
            'tcp_sent': 0,
            'tcp_received': 0,
            'udp': 10,
        },
        {
            'analyzer': 'analyzer-0004',
            'last_update': '2019/09/15 08:56:10',
            'tcp_sent': 0,
            'tcp_received': 0,
            'udp': 0,
        },
        {
            'analyzer': 'analyzer-0005',
            'last_update': '2019/09/15 00:00:00',
            'tcp_sent': 100,
            'tcp_received': 50,
            'udp': 100,
        },
        {
            'analyzer': 'analyzer-0006',
            'last_update': '2019/11/15 08:56:10',
            'tcp_sent': 545,
            'tcp_received': 25,
            'udp': 12,
        },
        {
            'analyzer': 'analyzer-home-01',
            'last_update': '2019/10/15 08:56:10',
            'tcp_sent': 1,
            'tcp_received': 1,
            'udp': 1,
        },
    ]

    return JsonResponse(Results_Formatted, safe=False)


@login_required(login_url=settings.LOGIN_URL)
def dashboard_access_points(_):

    Results_Formatted = [
        {
            'access_point': 'Wifi_Home',
            'mac': '00:00:00:00',
            'tot_users': 5,
        },
        {
            'access_point': 'Wifi_Home',
            'mac': '00:00:00:05',
            'tot_users': 5,
        },
        {
            'access_point': 'Wifi_Home',
            'mac': 'FF:FF:FF:FF',
            'tot_users': 0,
        },
        {
            'access_point': 'Wifi_Home',
            'mac': 'FF:FF:FF:FE',
            'tot_users': 100,
        },
    ]

    return JsonResponse(Results_Formatted, safe=False)


@login_required(login_url=settings.LOGIN_URL)
def dashboard_head_unit(_):

    Results_Formatted = [
        {
            'head_units': 'head-unit-0001',
            'access_point': 'Wifi_Home',
            'download': 100,
            'uploads': 100,
            'latency': 20,
        },
        {
            'head_units': 'head-unit-0002',
            'access_point': 'Wifi_Home',
            'download': 50,
            'uploads': 50,
            'latency': 10,
        },
        {
            'head_units': 'head-unit-0003',
            'access_point': 'Wifi_Home',
            'download': 200,
            'uploads': 200,
            'latency': 2,
        },
        {
            'head_units': 'head-unit-0004',
            'access_point': 'Wai_Fai_2GHz',
            'download': 0,
            'uploads': 0,
            'latency': 0,
        },
        {
            'head_units': 'head-unit-dev-0001',
            'access_point': 'Wai_Fai_5GHz',
            'download': 999,
            'uploads': 999,
            'latency': 999,
        },
    ]

    return JsonResponse(Results_Formatted, safe=False)


@login_required(login_url=settings.LOGIN_URL)
def dashboard_troubles(_):

    Results_Formatted = [
        {
            'time': '2019/09/15 10:00:00',
            'machine': 'analyzer-0003',
            'trouble': 'Tcp traffic too low',
            'solved': False,
        },
        {
            'time': '2019/09/15 10:00:00',
            'machine': 'analyzer-0004',
            'trouble': 'Lost connection',
            'solved': False,
        },
        {
            'time': '2019/09/15 10:00:00',
            'machine': 'Wai_Fai_5GHz',
            'trouble': 'Too many connected users',
            'solved': False,
        },
        {
            'time': '2019/09/15 10:00:00',
            'machine': 'Wai_Fai_2GHz',
            'trouble': 'Internet traffic too low',
            'solved': False,
        },
    ]

    return JsonResponse(Results_Formatted, safe=False)


@login_required(login_url=settings.LOGIN_URL)
def dashboard_channel_analysis(_):

    Results_Formatted = [
        {
            'channel': 1,
            'access_point': 'Wifi_Home',
            'rssi': -30,
        },
        {
            'channel': 1,
            'access_point': 'Wai_Fai_2GHz',
            'rssi': -50,
        },
        {
            'channel': 2,
            'access_point': 'Wai_Fai_2GHz',
            'rssi': -50,
        },
    ]

    return JsonResponse(Results_Formatted, safe=False)


@ensure_csrf_cookie  # Add csrf cookie to the web page for future post requests.
@login_required(login_url=settings.LOGIN_URL)
def dashboard_view(request):
    """
    Main web page. The only required is the list of hostnames observed in the system.

    :param request: request object.
    :return:
    """

    Username = request.user.get_username()

    context = {}

    ##################################################
    return render(request, 'dashboard.html', context)
    ##################################################
