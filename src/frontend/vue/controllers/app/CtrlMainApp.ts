import baseCtrlMixIn from '@/controllers/baseController';

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
    };
  },
  created() {
    // TODO
  },
  methods: {
  },
};

export default CtrlMainApp;
