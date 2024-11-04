import base64
from hashlib import md5

from django.conf import settings
from django.shortcuts import reverse
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
        key = base64.urlsafe_b64encode(md5(original_url.encode()).digest()).decode()
        key = key.replace("=", "")[:settings.URL_HASH_LENGTH]
        defaults = dict(validated_data)
        defaults["creator_ip"] = get_ip(request)
        defaults["creator_user_agent"] = get_user_agent(request)
        sh_url, created = ShortenUrl.objects.get_or_create(key=key, defaults=defaults)
        return sh_url

    def to_representation(self, instance):
        result = super().to_representation(instance)
        url = reverse('url_dispatcher', kwargs={'token': instance.key})
        full_url = self.context['request'].build_absolute_uri(url)
        result['redirect_to'] = full_url
        return result
