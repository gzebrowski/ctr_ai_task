export class Http {
  private apiRoot: string;

  private defaultHeaders: any;

  constructor(apiRoot = '/', defaultHeaders: any = null) {
    this.defaultHeaders = defaultHeaders || {};
    this.apiRoot = apiRoot;
  }

  prepareUrl(url: string, params?: any, options?: any) { // eslint-disable-line
    let theApiRoot = this.apiRoot;
    if (url && url[0] === '/') {
      theApiRoot = '';
    }
    let params2 = params;
    if (params && typeof params === 'object') {
      const q: any[] = [];
      Object.keys(params).forEach((key) => {
        const val = params[key];
        q.push(`${key}=${encodeURIComponent(val)}`);
      });
      params2 = q.join('&');
    }
    let addSlash = '';
    if (url.indexOf('/') === -1) {
      addSlash = '/';
    }
    const finalUrl = url.replace('.', '/') + addSlash + ((params2) ? `?${params2}` : '');
    return { url: finalUrl.replace('//', '/'), baseURL: theApiRoot };
  }

  prepareDefaultHeaders() {
    const headers = this.defaultHeaders || {};
    const finalHeaders: any = {};
    let val = null;
    Object.keys(headers).forEach((k) => {
      if (typeof headers[k] === 'function') {
        val = headers[k]();
      } else {
        val = headers[k];
      }
      if (val) {
        finalHeaders[k] = val;
      }
    });
    return finalHeaders;
  }

  applyHeaders(p?: any) {
    const p2 = { ...(p || {}) };
    if (this.defaultHeaders) {
      const hdrs = this.prepareDefaultHeaders();
      const headers = { ...hdrs, ...(p.headers || {}) };
      p2.headers = headers;
    }
    return p2;
  }

  // eslint-disable-next-line no-unused-vars
  processResponse(response: any) { // eslint-disable-line
  }

  sendReq(method: string, url: string, httpParams?: any, options?: any) { // eslint-disable-line
    const promiseObj = new Promise((resolve, reject) => {
      let httpParams2 = { ...(httpParams || {}) };
      httpParams2.url = url;
      httpParams2.method = method;
      httpParams2 = this.applyHeaders(httpParams2);
      const options2 = httpParams.options || options;
      if (httpParams.options) {
        delete httpParams.options;
      }
      if (options2) {
        httpParams2 = $.extend(true, httpParams2, options2);
      }
      if (method === 'tst') {
        consoleLog('test req', httpParams2);
        setTimeout(() => {
          resolve({ status: 'OK' });
        });
      } else {
        axios(httpParams2)
          .then((response) => {
            this.processResponse(response);
            if (response.data && response.data.action === 'redirect') {
              if (response.data.url) {
                window.location.href = response.data.url;
                return;
              }
            }
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response);
          });
      }
    });
    return promiseObj;
  }

  static xCheckParamsOpts(params?: any, options?: any) {
    let result;
    if (params && typeof params === 'object' && !options && (params.statusEvent || params.apiRoot)) {
      // in that case first param is "options", not params...
      result = { params: {}, options: params };
    } else {
      result = { params: params || {}, options };
    }
    return result;
  }

  xGetCommon(method: string, url: string, config?: any, options?: any) {
    const parOpt = Http.xCheckParamsOpts(config, options);
    const finalurl = this.prepareUrl(url, parOpt.params.getParams, parOpt.options);
    if (finalurl.baseURL) { parOpt.params.baseURL = finalurl.baseURL; }
    return this.sendReq(method, finalurl.url, parOpt.params, parOpt.options);
  }

  xPostCommon(method: string, url: string, data?: any, params?: any, options?: any) {
    // params - axios specific request configuration, options - app specific configuration
    const parOpt = Http.xCheckParamsOpts(params, options);
    const finalurl = this.prepareUrl(url, parOpt.params.getParams, parOpt.options);
    if (finalurl.baseURL) { parOpt.params.baseURL = finalurl.baseURL; }
    parOpt.params.data = data;
    return this.sendReq(method, finalurl.url, parOpt.params, parOpt.options);
  }

  get(url: string, getParams?: any, config?: any, options?: any) {
    // for get method we can pass object with GET params as second parameter
    const config2 = { ...(config || {}) };
    if (getParams) {
      config2.getParams = getParams;
    }
    return this.xGetCommon('get', url, config2, options);
  }

  tst(url: string, data?: any, config?: any, options?: any) {
    return this.xPostCommon('tst', url, data, config, options);
  }

  post(url: string, data?: any, config?: any, options?: any) {
    return this.xPostCommon('post', url, data, config, options);
  }

  put(url: string, data?: any, config?: any, options?: any) {
    return this.xPostCommon('put', url, data, config, options);
  }

  patch(url: string, data?: any, config?: any, options?: any) {
    return this.xPostCommon('patch', url, data, config, options);
  }

  delete(url: string, config?: any, options?: any) {
    return this.xGetCommon('delete', url, config, options);
  }

  head(url: string, config?: any, options?: any) {
    return this.xGetCommon('head', url, config, options);
  }

  options(url: string, config?: any, options?: any) {
    return this.xGetCommon('options', url, config, options);
  }
}

export class HttpApi extends Http {
  constructor() {
    super('/api/v1/', {});
  }
}

const httpApi = new HttpApi();
export default httpApi;