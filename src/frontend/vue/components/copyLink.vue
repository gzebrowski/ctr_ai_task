<template>
<div :class="cls || ''"><a v-acc-key @click="copyUrl()" class="pointer"><slot></slot></a><div
  class="alert alert-outline-info border" v-if="showMessage">Link został skopiowany</div></div>
</template>
<script>

/*
Properties: 'url', 'cls', 'alert'
This just generates link that when clicked it copies given url to clipboard. If not provided, then current url
is used. If alert is provided it will show app alert with the provided message. Else the default message will be shown.
This directive uses the content as the label of the link.
*/

export default {
  name: 'copyLink',
  props: ['url', 'cls', 'alert'],
  data() {
    return {
      showMessage: false,
    };
  },
  methods: {
    copyUrl() {
      window.navigator.clipboard.writeText(this.url || window.location.href);
      this.showMessage = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 2000);
    },
  },
};
</script>
