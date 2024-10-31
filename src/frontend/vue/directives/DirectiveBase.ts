import AppVue from '@/utils/base';

AppVue.registerDirective('selectInputText', {
  // used to focus on element (some input that we expect users to enter text)
  mounted: (input: object) => {
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);
  },
});
