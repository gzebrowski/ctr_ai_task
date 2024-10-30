from django.shortcuts import get_object_or_404
from django.views.generic import RedirectView
from rest_framework.generics import CreateAPIView
from rest_framework.viewsets import ViewSetMixin

from apps.shortenurl.models import ShortenUrl, UrlStat
from apps.shortenurl.serializers import ShortenUrlSerializer


class ShortenUrlView(ViewSetMixin, CreateAPIView):
    serializer_class = ShortenUrlSerializer


class UrlDispatcherView(RedirectView):
    permanent = False  # we do not want to cache it by browsers, so explicitly passed what is default...

    def get_redirect_url(self, *args, **kwargs):
        shorten_url = get_object_or_404(ShortenUrl, key=kwargs["token"])
        shorten_url.used = shorten_url.used + 1
        shorten_url.save()
        UrlStat.objects.create(shorten_url=shorten_url)
        return shorten_url.original_url
