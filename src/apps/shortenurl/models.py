from django.db import models


class ShortenUrl(models.Model):
    original_url = models.URLField()
    key = models.CharField(max_length=255, unique=True)
    creator_ip = models.CharField(max_length=255, null=True, blank=True)
    creator_user_agent = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.IntegerField(default=0)

    def __str__(self):
        return self.key


class UrlStat(models.Model):
    shorten_url = models.ForeignKey(ShortenUrl, on_delete=models.CASCADE)
    visited_at = models.DateTimeField(auto_now_add=True)
