import baseCtrlMixIn from '@/controllers/baseController';
import httpApi from '@/utils/http';
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
    // TODO
  },
  methods: {
    shortenLink() {
      this.sending = true;
      httpApi.post('short-url', { original_url: this.linkToShortcut }).then((resp: object) => {
        this.sending = false;
        this.currentRedirectUrl = resp.redirect_to;
      });
    },
  },
};

export default CtrlMainApp;
