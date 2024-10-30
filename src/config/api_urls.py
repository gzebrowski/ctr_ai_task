from rest_framework.routers import DefaultRouter

from apps.shortenurl.views import ShortenUrlView

router = DefaultRouter()
router.register("short-url", ShortenUrlView, basename="shorten_url")

urlpatterns = router.urls
