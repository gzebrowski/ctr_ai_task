import baseCtrlMixIn from '@/controllers/baseController';
import httpApi from '@/utils/http';
import helpers from '@/utils/utils';
/*
Used as controller of help center page. This is the place to add specific logic for it
*/

const CtrlMainApp = {
  name: 'ctrlMainApp',
  el: '.main-app',
  mixins: [
    baseCtrlMixIn,
  ],
  data(): object {
    return {
      linkToShortcut: '',
      currentRedirectUrl: '',
      sending: false,
      lastLinks: [],
    };
  },
  computed: {
    isLinkValid() {
      const isValid = this.linkToShortcut && this.linkToShortcut.match(
        /^https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*(\/[^\s]+)?$/i,
      );
      return isValid;
    },
  },
  created() {
    this.lastLinks = helpers.localStorage.get('lastLinks') || [];
  },
  methods: {
    shortenLink() {
      this.sending = true;
      httpApi.post('short-url', { original_url: this.linkToShortcut }).then((resp: object) => {
        this.sending = false;
        if (resp.redirect_to) {
          this.currentRedirectUrl = resp.redirect_to;
          this.storeLink(this.linkToShortcut, resp.redirect_to);
        }
      });
    },
    storeLink(originalUrl: string, shortenedUrl: string) {
      if (this.lastLinks.filter((itm: object) => itm.shortenedUrl === shortenedUrl).length) {
        return;
      }
      this.lastLinks.unshift({ originalUrl, shortenedUrl });
      if (this.lastLinks.length > 3) {
        this.lastLinks.length = 3;
      }
      helpers.localStorage.set('lastLinks', this.lastLinks);
    },
  },
};

export default CtrlMainApp;
