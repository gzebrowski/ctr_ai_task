import os
import re

from django import template
from django.conf import settings
from django.templatetags.static import static
from django.utils.html import format_html
from django.utils.safestring import mark_safe

register = template.Library()


def static_hash_data(file_name: str) -> tuple[str, str]:
    hash_file = os.path.join(settings.APP_TEMPLATES_DIR, "dynamic/build_hash.txt")
    hash_val = open(hash_file).read() if os.path.isfile(hash_file) else ""
    url = static(f"webpack_bundles/{file_name}")
    return url, hash_val


@register.simple_tag
def load_script_hash(script_name: str) -> str:
    url, hash_val = static_hash_data(script_name)
    return format_html(f'<script src="{url}?_z={hash_val}"></script>')


@register.simple_tag
def load_style_hash(css_name: str) -> str:
    url, hash_val = static_hash_data(css_name)
    return format_html(f'<link rel="stylesheet" type="text/css" href="{url}?_z={hash_val}" />')


@register.filter
def replace(value: str, replace_data: str) -> str:
    pattern, replacement = replace_data.split(":")
    return re.sub(pattern, replacement, value)


@register.filter
def safe_css(value: str) -> str:
    """
    We only want to preserve such cases like .some-selector > .another-selector
    """
    value = value.replace("&", "&amp;").replace(">", " >").replace("<", "&lt;")
    return mark_safe(value)


@register.filter
def safe_js(value: str) -> str:
    value = value.replace("<", "< ").replace(">", " >")
    return mark_safe(value)
