import { createApp } from 'vue';
import helpers from '@/utils/utils';

export default class AppVue {
  /* it is base class for the project
      We can register vue instances by AppVue.register method by passing its name and the
      object that we pass normally for Vue instance. We don't have to worry if the other
      parts of js is started and the DOM is ready. After running the instance will be
      available in AppVue.instances['the_name_passed_as_first_param']
  */

  static instances: object = {};

  static plugins: object[] = [];

  static instanceParams: object[] = [];

  static components: object[] = [];

  static directives: object[] = [];

  constructor(...vals: object[]) {
    let param;
    let name = '';
    if (typeof vals[0] === 'string') {
      [name, param] = vals;
    } else {
      [param] = vals;
    }
    if (param.el && document.querySelectorAll(param.el).length) { // if this element really exists in the DOM
      const instance = createApp(param);
      if (name) {
        AppVue.instances[name] = instance;
      }
      helpers.forEach(AppVue.components, (comp: Array<{ string, object }>) => { // attach all registered components to the instance
        instance.component(comp[0], comp[1]);
      });
      helpers.forEach(AppVue.directives, (directive) => { // and the directives
        instance.directive(directive[0], directive[1]);
      });
      instance.mount(param.el); // finally after all mount the instance
    }
  }

  static register(...params: object[]) {
    if (!AppVue.instanceParams.filter((c: Array<{ string, object }>) => c[0] === params[0]).length) {
      AppVue.instanceParams.push(params);
    }
  }

  static registerPlugin(plugin: object, params: object | null = null) {
    AppVue.plugins.push([plugin, params]);
  }

  static registerDirective(name: string, directive: object) {
    if (!AppVue.directives.filter((c: Array<{ string, object }>) => c[0] === name).length) {
      AppVue.directives.push([name, directive]);
    }
  }

  static registerComponent(name: string, config: object) {
    if (!AppVue.components.filter((c: Array<{ string, object }>) => c[0] === name).length) {
      AppVue.components.push([name, config]);
    }
  }

  static run() {
    AppVue.instanceParams.forEach((item: Array) => {
      let paramSet;
      let name = '';
      if (item.length > 1 && typeof item[0] === 'string') {
        [name, paramSet] = item;
      } else {
        paramSet = item;
      }
      if (!paramSet.el || document.querySelectorAll(paramSet.el).length) {
        // if such element exists in DOM, then it means, that we have found the right params to create instance of the
        // controller. So create instance, and this will create one and bind all components, directives, etc to it
        // eslint-disable-next-line no-new
        new AppVue(name, paramSet);
      }
    });
  }
}
