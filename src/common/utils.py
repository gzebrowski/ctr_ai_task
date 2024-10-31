from django.http import HttpRequest


def get_ip(request: HttpRequest) -> str:
    # todo: we need to investigate the request, because sometimes the IP is somewhere else
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


def get_user_agent(request: HttpRequest) -> str:
    return request.META.get("HTTP_USER_AGENT")
