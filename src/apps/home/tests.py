from django.test import Client, TestCase
from django.urls import reverse


class HomeTestCase(TestCase):
    def test_home_page(self):
        client = Client()
        response = client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
