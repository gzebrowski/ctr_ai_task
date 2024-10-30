from django.contrib import admin

from apps.shortenurl.models import ShortenUrl, UrlStat


@admin.register(ShortenUrl)
class ShortenUrlAdmin(admin.ModelAdmin):
    list_display = ["id", "key", "original_url", "creator_ip", "created_at", "used"]


@admin.register(UrlStat)
class UrlStatAdmin(admin.ModelAdmin):
    list_display = ["id", "shorten_url", "visited_at"]
    raw_id_fields = ["shorten_url"]
