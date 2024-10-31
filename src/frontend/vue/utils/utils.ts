// import jquery from 'jquery';
import Axios from 'axios';
// const axios = require('axios');

const axios = Axios;

export class Deferred {
  public resolve: () => void;

  public reject: () => void;

  public promise: Promise;

  constructor() {
    this.resolve = null;
    this.reject = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    Object.freeze(this);
  }
}

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

type forEachCallback = (itm: unknown, keyOrNr?: number|string) => unknown; // eslint-disable-line

const helpers = {
  forEach(items: Array<object> | object, callback: forEachCallback, context?: unknown) {
    // iterates both lists and objects. The first param is the object to be iterated and the second parameter is the
    // callable that takes 2 params. For list the first param is the item of the array and second param is the index
    // 0-indexed. For objects the first parameter is the value, the second is the key. It optionally takes also context
    // in witch this callable could be called.
    if (typeof items === 'object' && typeof items.length === 'undefined') {
      const arr = Object.keys(items);
      for (let x = 0; x < arr.length; x += 1) {
        let result;
        const obj = items[arr[x]];
        if (context) {
          result = callback.call(context, obj, arr[x]);
        } else {
          result = callback(obj, arr[x]);
        }
        if (result === false) {
          break;
        }
      }
    } else if (typeof items.length !== 'undefined') {
      let result;
      for (let x = 0; x < items.length; x += 1) {
        if (context) {
          result = callback.call(context, items[x], x);
        } else {
          result = callback(items[x], x);
        }
        if (result === false) {
          break;
        }
      }
    }
  },
  deepCopy(v: unknown) {
    // creates copy of object to prevent from affecting the source data when changing its content
    return JSON.parse(JSON.stringify(v));
  },
  xStorageGet(storEng: object, key: string, def?: unknown) {
    const v = storEng.getItem(`storage_${key}`);
    if (v === null && def !== null) {
      return def;
    }
    if (v) {
      if (v.expires) {
        if (v.expires < new Date().getTime()) {
          storEng.removeItem(`storage_${key}`);
          return def;
        }
      }
      return JSON.parse(v).value;
    }
    return null;
  },
  xStorageSet(storEng: object, key: string, val: unknown, expires: number|null = null) {
    storEng.setItem(`storage_${key}`, JSON.stringify({ value: val, expires }));
  },
  xStorageRemove(storEng: object, key: string) {
    storEng.removeItem(`storage_${key}`);
  },
  localStorage: {
    // helpers.localStorage is a wrapper of build in window.localStorage, that stores data under provided key prefixed
    // with some value that is for preventing from namespace conflicts. And also serializers any objects and checks if
    // it is still valid (in case the expiration date was provided during setting)
    get(key: string, def?: unknown) {
      return helpers.xStorageGet(window.localStorage, key, def);
    },
    set(key: string, val: unknown, expires: number|null = null) {
      return helpers.xStorageSet(window.localStorage, key, val, expires);
    },
    remove(key: string) {
      return helpers.xStorageRemove(window.localStorage, key);
    },
  },
  sessionStorage: {
    getOnce(key: string, def?: unknown) {
      // gets only once, and then removes from session storage
      const result = helpers.xStorageGet(window.sessionStorage, key, null);
      if (result !== null) {
        helpers.sessionStorage.remove(key);
        return result;
      }
      return def;
    },
    get(key: string, def?: unknown) {
      return helpers.xStorageGet(window.sessionStorage, key, def);
    },
    set(key: string, val: unknown, expires: number|null = null) {
      return helpers.xStorageSet(window.sessionStorage, key, val, expires);
    },
    remove(key: string) {
      return helpers.xStorageRemove(window.sessionStorage, key);
    },
  },
  refreshPage() {
    const lc = window.location.href.split('#')[0];
    window.location.href = lc;
  },
};

export default helpers;
