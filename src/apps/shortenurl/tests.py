import urllib.parse

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.shortenurl.models import ShortenUrl

sh_url = reverse('api:shorten_url-list')


class TestShortenUrl(APITestCase):
    TEST_URL1 = 'https://www.example.com/path1/path2/?param1=a&param2=b#hash1'
    TEST_URL2 = 'https://www.example.com/path3/'

    def test_create_shorten_link(self):
        for nr, tst_url in enumerate([self.TEST_URL1, self.TEST_URL2, self.TEST_URL1]):
            data = {'original_url': tst_url}
            response = self.client.post(sh_url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(ShortenUrl.objects.filter(original_url=tst_url).count(), 1)
            self.assertEqual(response.data['original_url'], tst_url)
            self.assertEqual(ShortenUrl.objects.all().count(), min(2, nr + 1))
            self.assertTrue(bool(response.data.get('redirect_to')))

            redirect_url = urllib.parse.urlparse(response.data['redirect_to']).path
            redirect_resp = self.client.get(redirect_url)
            self.assertRedirects(redirect_resp, expected_url=response.data['original_url'], status_code=302,
                                 fetch_redirect_response=False)

    def test_validate_url(self):
        data = {'original_url': 'test wrong url format'}
        response = self.client.post(sh_url, data, format='json')
        self.assertEqual(response.status_code, 400)
