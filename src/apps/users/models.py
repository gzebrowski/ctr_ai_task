# -*- coding:utf-8 -*-

from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import ValidationError, validate_email


class ProfileUserManager(UserManager):
    @classmethod
    def normalize_email(cls, email):
        if not email:
            return None
        return email.strip().lower()

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        if "is_active" not in extra_fields:
            extra_fields["is_active"] = False
        username, email = self._prepare_login_fields(username, email)
        return super().create_user(username, email, password, **extra_fields)

    def _prepare_login_fields(self, username, email):
        try:
            validate_email(username)
        except ValidationError:
            pass
        else:
            if not email:
                email = username
        if not username and email:
            username = email
        return username, email

    def create_superuser(
        self, username=None, email=None, password=None, **extra_fields
    ):
        extra_fields["is_active"] = True
        username, email = self._prepare_login_fields(username, email)
        return super(ProfileUserManager, self).create_superuser(
            username, email, password, **extra_fields
        )


class ProfileUser(AbstractUser):
    REQUIRED_FIELDS = []
    USERNAME_FIELD = "email"
    objects = ProfileUserManager()

    def __str__(self):
        return "%s" % self.full_name


ProfileUser._meta.get_field("email")._unique = True
username_field = ProfileUser._meta.get_field("username")
username_field._unique = False
username_field.blank = True
username_field.max_length = 255
