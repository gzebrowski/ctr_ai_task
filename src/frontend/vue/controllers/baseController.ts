const baseController = {
  data() {
    return {
    };
  },
  methods: {
    stopPropagation(evt: object) {
      // to be used in templates as @click="doSomething() && stopPropagation($event)"
      evt.stopPropagation();
      return false;
    },
    checkIn(val: unknown, inValues: Array<unknown>) {
      // to be used in templates - works as python 'in' operator
      return inValues.indexOf(val) > -1;
    },
    checkNotIn(val: unknown, inValues: Array<unknown>) {
      // to be used in templates - works as python 'not in' operator
      return inValues.indexOf(val) === -1;
    },
    switchPageTheme() {
      // switches the theme between light and dark
      const pageTheme: string = window.localStorage.getItem('pageTheme');
      const newTheme = (pageTheme === 'dark') ? 'light' : 'dark';
      const fn = (newTheme === 'dark') ? 'add' : 'remove';
      window.document.querySelector('body').classList[fn]('darktheme');
      window.localStorage.setItem('pageTheme', newTheme);
    },
  },
};
export default baseController;
