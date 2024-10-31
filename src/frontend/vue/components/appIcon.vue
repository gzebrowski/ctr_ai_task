<template>
<i class="app-icon mdi" :class="extraClasses" :aria-label="title || ''" :title="title || ''"></i>
</template>
<script>
import utils from '../utils/utils';

/*
Simply creates system icon element provided the icon key, title (the html attribute) and extra css classes
*/

const {
  helpers,
} = utils;

export default {
  name: 'appIcon',
  props: ['classes', 'ico', 'title'],
  data() {
    return {
      extraClasses: '',
    };
  },
  watch: {
    classes(value) {
      this.setClasses(value);
    },
    ico() {
      this.setClasses(this.classes || {});
    },
  },
  created() {
    this.setClasses(this.classes || {});
  },
  methods: {
    setClasses(value) {
      const final = [];
      if (this.ico) {
        final.push(`mdi-${this.ico}`);
      }
      helpers.forEach(value, (v, k) => {
        if (v) {
          final.push(`mdi-${k}`);
        }
      });
      this.extraClasses = final.join(' ');
    },
  },
};
</script>
