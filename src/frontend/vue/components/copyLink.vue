<template>
<div class="copy-link-com">
  <div class="p-relative" :class="cls || ''">
    <input type="text" v-model="urlToCopy" readonly class="d-inline-block w-100 pr-4">
    <span class="copy-msg" v-if="showMessage">Copied</span>
    <a @click="copyUrl()" class="pointer p-absolute abs-right z9 d-inline-block icon-holder">
      <svg viewBox="0 0 512 512">
        <g data-name="1" id="_1">
          <path d="M308.51,450H80.59a15,15,0,0,1-15-15V143.93a15,15,0,0,1,15-15H308.51a15,15,0,0,1,15,15V435A15,15,0,0,1,308.51,450ZM95.59,420H293.51V158.93H95.59Z"/><path d="M389.44,369.07H308.51a15,15,0,0,1,0-30h65.93V78H176.52v65.92a15,15,0,0,1-30,0V63a15,15,0,0,1,15-15H389.44a15,15,0,0,1,15,15V354.07A15,15,0,0,1,389.44,369.07Z"/>
        </g>
      </svg>
    </a>
  </div>
</div>
</template>
<script>

export default {
  name: 'copyLink',
  props: ['url', 'cls'],
  data() {
    return {
      showMessage: false,
      urlToCopy: '',
    };
  },
  created() {
    this.urlToCopy = this.url;
  },
  watch: {
    url() {
      this.urlToCopy = this.url;
    },
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
