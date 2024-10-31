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
      linktToShortcut: '',
    };
  },
  computed: {
    isLinkValid() {
      const isValid = this.linktToShortcut &&  this.linktToShortcut.match(
        /^https?:\/\/[a-z0-9-]+(\.[a-z0-9-])*(\/[^\s]+)?$/i);
      return isValid;
    },
  },
  created() {
    // TODO
  },
  methods: {
    shortenLink() {
      httpApi.post();
    },
  },
};

export default CtrlMainApp;
