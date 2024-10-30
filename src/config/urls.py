from django.contrib import admin
from django.urls import include, path, register_converter
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from apps.home import views as home_views
from apps.shortenurl.views import UrlDispatcherView
from common.url_converters import HashConverter

register_converter(HashConverter, "hash")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "schema/swagger-ui/",
        SpectacularSwaggerView.as_view(
            template_name="../templates/swagger-ui.html", url_name="schema"
        ),
        name="swagger-ui",
    ),
    path(
        "schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
    path("api/", include(("config.api_urls", "api"))),
    path("pl-<hash:token>", UrlDispatcherView.as_view(), name="url_dispatcher"),
    path("", home_views.HomeView.as_view(), name="home"),
]
