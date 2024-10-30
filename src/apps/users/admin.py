# -*- coding:utf-8 -*-

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import ProfileUser


@admin.register(ProfileUser)
class ProfileAdmin(UserAdmin):
    list_display = [
        "id",
        "username",
        "email",
        "is_active",
        "is_staff",
        "is_superuser",
        "last_login",
    ]
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
