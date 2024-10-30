import base64
from hashlib import md5

from django.conf import settings
from rest_framework import serializers

from apps.shortenurl.models import ShortenUrl
from common.utils import get_ip, get_user_agent


class ShortenUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenUrl
        fields = ("original_url",)

    def create(self, validated_data):
        request = self.context["request"]
        original_url = validated_data.get("original_url")
        key = base64.urlsafe_b64encode(md5(original_url).digest())
        key = key.replace("=", "")[: settings.URL_HASH_LENGTH]
        defaults = dict(validated_data)
        defaults["creator_ip"] = get_ip(request)
        defaults["creator_user_agent"] = get_user_agent(request)
        sh_url, created = ShortenUrl.objects.get_or_create(key=key, defaults=defaults)
        return sh_url
