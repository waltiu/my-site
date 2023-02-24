[Axios](https://www.axios-http.cn/docs/intro) 是一个基于 *[promise](https://javascript.info/promise-basics)* 网络请求库，作用于[`node.js`](https://nodejs.org/) 和浏览器中。 它是 *[isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application)* 的(即同一套代码可以运行在浏览器和node.js中)。在服务端它使用原生 node.js `http` 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。Axios基本是开箱即用，但是在我们的日常开发中，可能会存在部分场景我们需要在Axios之上进行加工（请求封装，参数加工，取消请求，错误拦截及界面loading等），下面我们一起来开搞，开搞！！！

## 准备工作
 使用vite快速搭建一个react项目，并安装axios依赖。
 
```
 npm create vite@latest
 cd vite-project
 pnpm install axios
```
初始项目搭好了，那我们需要想一想我们的axios库需要支持哪些功能？      

1. 常用的get和post封装
2. 支持jsonp请求
3. 支持全局loading
4. 请求失败自动重试
5. 重复或者路由切换放弃请求
6. 响应数据处理及统一错误提示

按照上面的ToDoList，我们对目录结构优化下，如下：

![ME1668066616748.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2364dbb1794742a6989161ecc66af118~tplv-k3u1fbpfcp-watermark.image?)

## Axios的基础功能（get，post）
src/lib/index.ts下添加以下代码：
```
import axios, { AxiosRequestConfig } from "axios";
import { processUrl } from "./utils";

//  基于axios封装get和post请求
const sendRequest = (
  method: any,
  url: string,
  params?: any,
  config: AxiosRequestConfig = {}
) => {
  return axios({
    method,
    url:processUrl(url), // url进行统一加工处理，processUrl抽离到utils下并引入
    data: params,
    ...config,
  });
};

export const httpGet = (url: string, params?: any, config?: AxiosRequestConfig) => {
  return new Promise((resolve) => {
    sendRequest("get", url, params, config).then(resolve).catch(resolve);
  });
};

export const httpPost = (url:string, params?: any, config?: AxiosRequestConfig) => {
  return new Promise((resolve) => {
    sendRequest("post", url, params, config).then(resolve).catch(resolve);
  });
};
export default {
  httpGet,
  httpPost
};
```
src/lib/utils.ts加入以下代码：

```
// url统一用/开头
export const processUrl = (url: string) => {
  if (url && !/^https?:\/\//i.test(url) && !url.startsWith("/")) {
    return `/${url}`;
  }
  return url;
};
```
现在已经可以满足基本的请求功能了，但是默认配置不一定满足所有的需求。我们在src/lib下创建一个init.ts文件并声明一个types文件，用来定义我们的初始化配置。

```
// src/lib/types.ts
import { AxiosRequestConfig } from "axios";

// 针对我们上面定义的ToDoList先定义下可配置参数
export type AxiosCustomConfigType={
  retry?:number, // 请求失败重试，>0进行重试
  retryDelay?:number // 重试间隔时间
  ignoreLoading?:boolean // 是否忽略loading，默认不忽略
  changeLoadingStatus?: (loading: boolean) => void; // 修改loading状态
  abortable?:boolean, // 重复请求是否放弃
  aborted?:boolean // 当前请求是否将被放弃，放弃的将不会进行loading
}

export type AxiosConfigType=AxiosCustomConfigType&AxiosRequestConfig

```

```
//src/lib/init.ts
import { AxiosRequestConfig } from "axios";
import { AxiosCustomConfigType, PeddingKeyDataType } from "./types";
import { processUrl } from "./utils";

// axios的内置配置 https://www.axios-http.cn/docs/req_config

class HttpRequest {
  requestMap = new Map(); // 请求队列，后面有用
  system: AxiosRequestConfig; // axios内置配置
  custom: AxiosCustomConfigType; // 我们针对axios封装的自定义配置

  // system：axios内置配置， custom：用户自定义配置
  constructor(system: AxiosRequestConfig, custom: AxiosCustomConfigType) {
    this.system = system;
    this.custom = custom;
  }
  
  // 在组件挂载的时候可以通过调用init方法来初始化配置
  init(system: AxiosRequestConfig , custom: AxiosCustomConfigType ) {
    if (typeof system === "object") {
      this.system = {
        ...(this.system||{}),
        ...(system || {}),
      };
    }

    if (typeof custom === "object") {
      this.custom = {
        ...(this.custom||{}),
        ...(custom || {}),
      };
    }
  }

export default new HttpRequest({}, {
  retry:0, 
  retryDelay:1000,
  abortable:false
});

```
既然我们的自定义配置项有了，那我们要把配置放入到我们的请求中，修改下index.ts代码：

```
import axios, { AxiosRequestConfig } from "axios";
import httpConfig from "./init";
import { AxiosConfigType, AxiosCustomConfigType } from "./types";
import {  processUrl } from "./utils";

// 将在init中定义的配置赋到axios上
// @ts-ignore
axios.defaults = {
  ...httpConfig.system,
};

const sendRequest = (
  method: any,
  url: string,
  params?: any,
  config: AxiosConfigType = {}
) => {
  return axios({
    method,
    url: processUrl(url),
    data: params,
    // 自定义配置放到axios的config上，方便后续来使用
    ...httpConfig.custom||{},
    ...config,
  });
};

// 把init.ts中的init方法暴露出去
export const httpInit = (system:AxiosRequestConfig ={}, custom: AxiosCustomConfigType ={})=>httpConfig.init(system,custom);

/**
...上面的代码不动
**/

export default {
  httpGet,
  httpPost,
  httpInit,
};

```
那我们尝试来使用下吧

```
// 项目入口初始化，main.ts

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { httpInit } from "./lib";
import "./index.css";

httpInit(
  {},
  {}
);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

```
// app.ts下尝试调用下

import reactLogo from "./assets/react.svg";
import { httpPost } from "./lib";
import "./App.css";

function App() {
  const requestData = async () => {
    const result = await httpPost(`/test`, { name: 1 });
    console.log(result, "result");
  };
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => requestData()}>测试请求</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
```
## jsonp
jsonp，我们使用 [jsonp](https://github.com/webmodules/jsonp) 这个库进行封装下，我们先安装下jsonp的相关依赖。     

`yarn add jsonp @types/jsonp`    

然后在index.ts入口文件添加以下代码：

```
export type JsonpOptioins = {
  param?: string;
  timeout?: number;
  prefix?: string;
  name?: string;
  ignoreLoading?:boolean
};

export const jsonp= async (url: string, options?: JsonpOptioins) => {
  // https://github.com/webmodules/jsonp
  const jsonp = (await import('jsonp')).default;
  return new Promise((resolve, reject) => {
    jsonp(
      url,
      {
        ...(options || {}),
      },
      (err: Error | null, data: any) => {
        if (err) {
          errorLog(err)
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
}

/**
 ...其他代码
*/

export default {
  httpGet,
  httpPost,
  jsonp,
  httpInit,
};


```

让我们来试下我们基本功能封装的怎么样啦！
```
 // app.tsx中修改下请求点击的代码，然后点击看下结果吧
   import { jsonp } from "./lib";
   const requestData = async () => {
    const result = await jsonp(`https://www.baidu.com/sugrec?prod=pc&wd=2222`);
    console.log(result, "result");
  };
```

结果如下：

![ME1668071303178.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e1eff72d54449c4bb1fdcd377fa60df~tplv-k3u1fbpfcp-watermark.image?)

![ME1668071309471.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d9e8a4891b54c0ba39802b03e0b1505~tplv-k3u1fbpfcp-watermark.image?)

基础的请求功能已经封装好了，那我们来试试用 [拦截器](https://www.axios-http.cn/docs/interceptors) 来实现更多功能吧！

## loading
目前可能并不是所有请求都需要loading的，同时需要一个函数来接收loading的状态。     
我们在init的配置文件中新增了2个参数：`ignoreLoading` 和 `changeLoadingStatus`     
接下来开始实现我们的功能吧！

在src/lib/index.ts中，先把我们的拦截器配置赋到Axios上
```
import axios, { AxiosRequestConfig } from "axios";
import "./interceptors";
```

src/lib/interceptors/index.ts，添加axios拦截器
```js
import axios from 'axios';
import * as loadingInterceptor from './request/loadingInterceptor';

//官方文档： https://www.axios-http.cn/docs/interceptors

// 请求拦截(先定义的后生效,abortInterceptor会在loadingInterceptor前执行)
axios.interceptors.request.use(
  loadingInterceptor.onRequestFulfilled,
  loadingInterceptor.onRequestRejected
)

// 响应拦截（后定义的先生效，abortInterceptor会在loadingInterceptor前执行）
axios.interceptors.response.use(
  loadingInterceptor.onResponseFulfilled,
  loadingInterceptor.onResponseRejected
);

```
src/lib/interceptors/request/loadingInterceptor.ts，添加请求loading拦截器
```js
import http from "../../init";
// 当前未结束的请求数，统计时做了延迟处理
let requestCount = 0;

// 统计requestCount时的延迟时间，避免一个很快的请求也显示loading效果
const START_DELAY_TIME = 1500;
const END_DELAY_TIME = 250;

const changeRequestLoading = () => {
  const { changeLoadingStatus } = http.custom;
  if (changeLoadingStatus && typeof changeLoadingStatus === "function") {
    changeLoadingStatus(requestCount > 0);
  }
};

export const startRequest = (config:any) => {
  // 此请求不使用loading
  if (config && config.ignoreLoading) {
    return;
  }
  requestCount += 1;
  // 请求开始一段时间后，如果还有未结束的请求
  setTimeout(() => {
    if (requestCount > 0) {
      changeRequestLoading();
    }
  }, START_DELAY_TIME);
};

export const endRequest = (config:any) => {
  if (config) {
    // 此请求不使用loading
    if (config.ignoreLoading) {
      return;
    }
  }
  requestCount -= 1;

  // 请求结束一段时间后，如果还有未结束的请求
  setTimeout(() => {
    if (requestCount === 0) {
      changeRequestLoading();
    }
  }, END_DELAY_TIME);
};

export const onRequestFulfilled = (config:any) => {
  startRequest(config);
  return config;
};

export const onRequestRejected = (error:any) => {
  return Promise.reject(error);
};

export const onResponseFulfilled = (response:any) => {
  endRequest(response && response.config);
  return response;
};

export const onResponseRejected = (error:any) => {
  endRequest(error && error.config);
  return Promise.reject(error);
};
```
尝试调用一下吧，我们在入口init的时候，可以提供个函数来接收loading
状态

```
// main.ts
httpInit({}, {
  changeLoadingStatus(loading) {
    console.log(loading); // loading状态
  },
});
```

我们也希望jsonp请求也支持loading，我们来优化下！

```js
import { endRequest, startRequest } from "./interceptors/request/loadingInterceptor";

export const jsonp= async (url: string, options?: JsonpOptioins) => {
  // https://github.com/webmodules/jsonp
  const jsonp = (await import('jsonp')).default;
  return new Promise((resolve, reject) => {
    startRequest(options);
    jsonp(
      url,
      {
        ...(options || {}),
      },
      (err: Error | null, data: any) => {
        endRequest(options);
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
}

```

## 请求错误，自动重试
和loading一样，自动重试也是需要参数来控制的。   
在init.ts中我们定义2个参数：`retry` 和 `retryDelay`

新建src/lib/interceptors/response/retryInterceptor.ts文件，并添加以下代码：

```
import axios from 'axios';

export const onFulfilled = (response:any) => {
  return response;
};

// 请求配置设置retry后支持失败重试
export const onRejected = (res:any) => {
  if (res && res.config) {
    const { config } = res;
    // 如果配置不存在或重试属性未设置，抛出promise错误
    if (!config.retry) return Promise.reject(res);
    // 设置一个变量记录重新请求的次数
    config.retryCount = config.retryCount || 0;
    // 检查重新请求的次数是否超过我们设定的请求次数
    if (config.retryCount >= config.retry) {
      return Promise.reject(res);
    }
    // 重新请求的次数自增
    config.retryCount += 1;
    // 创建新的Promise来处理重新请求的间隙
    const back = new Promise<void>(function (resolve) {
      console.log(`接口${config.url}请求超时，重新请求`);
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1000);
    });
    // 返回axios的实体，重试请求
    return back.then(function () {
      return axios(config);
    });
  }
  return Promise.reject(res);
};
```
将 retryInterceptor.ts 添加到 interceptors/index.ts 下

```
import * as retryInterceptor from './response/retryInterceptor';

axios.interceptors.response.use(retryInterceptor.onFulfilled, retryInterceptor.onRejected);
```

## 重复请求，自动放弃
在写重复请求拦截器之前，我们需要先在init中维护一份`requestMap`

为每个请求添加一个penddingKey，抽出一个生成key的函数放到utils下
```
export type PeddingKeyDataType={
  pageUrl:string,
  requestUrl:string,
  abort:any
}

export const createRequestKey=(method:string,url:string,data:string)=>{
  return `${method}-${url}-${typeof data==='object'?JSON.stringify(data):data}`
}
```
init.ts中维护请求队列的删减，并进行请求放弃
```js
  requestMap = new Map();
    
  // 添加正在请求队列
  addRequestMap(requestKey: string, data?: PeddingKeyDataType) {
    if (this.requestMap.has(requestKey)) {
      this.deleteRequestMap(requestKey, true);
    } else {
      this.requestMap.set(requestKey, data);
    }
  }

  // 删除正在请求队列
  deleteRequestMap(requestKey: string, isAdd?: boolean) {
    // 放弃重复请求
    if (isAdd && this.requestMap.get(requestKey)?.abort) {
      console.log(`重复请求-${requestKey},已取消`);
      this.requestMap.get(requestKey)?.abort();
    } else {
      // 请求结束后删除请求
      this.requestMap.delete(requestKey);
    }
  }

  // 取消全部进行中的请求，可以传入白名单url,路由切换可用
  abortRequestPedding(urlList?:string[]){
    let peddingList=[...this.requestMap.values()]
    if(peddingList?.length){
      peddingList.forEach((peddingItem:PeddingKeyDataType)=>{
        // 请求的url地址中包含白名单，则不进行请求
        if(!(urlList||[]).find(item=>processUrl(peddingItem.requestUrl).includes(processUrl(item)))){
          peddingItem.abort&& peddingItem.abort()
        }
      })
    }
  }
```

接下来我们需要在创建一个拦截器，并调用init中定义的方法。
除此之外，我们需要给config设置`abortable`的请求，添加一个[AbortController](https://www.axios-http.cn/docs/cancellation)来实现取消请求。


```js
import axios from "axios";
import http from "../../init";
import { createRequestKey } from "../../utils";

// 重复请求自动取消后面的请求，通过abortable控制
export const onRequestFulfilled = (config:any) => {
  const { abortable, data, url, method } = config;
  const requestKey = createRequestKey(method, url, data);
  let abortController: any = null;
  const pageUrl = window.location.pathname;
  if (abortable) {
    const CancelToken = axios.CancelToken;
    abortController = CancelToken.source();
    config.cancelToken = abortController.token;
    if (http.requestMap.has(requestKey)) {
      abortController.cancel(
        `请求重复-${requestKey}：该请求已被取消，可通过abortable:false禁用`
      );
      config.aborted = true;
      return config;
    }
  }
  http.addRequestMap(requestKey, {
    requestUrl: url,
    pageUrl,
    abort: abortController?.cancel,
  });
  return config;
};

export const onRequestRejected = (error:any) => {
  return Promise.reject(error);
};

export const onResponseFulfilled = (response:any) => {
  const { data, url, method } = response;
  const requestKey = createRequestKey(method, url, data);
  http.deleteRequestMap(requestKey);
  return response;
};

export const onResponseRejected = (error:any) => {
  if (error.config) {
    const { data, url, method } = error.config;
    const requestKey = createRequestKey(method, url, data);
    http.deleteRequestMap(requestKey);
  }
  // TODO: 这里需要能拿到请求的config
  return Promise.reject(error);
};
```
`abortInterceptor` 拦截器已经写好了，现在设置了 `abortable`的请求都会被取消。那么被取消请求（设置了config.aborted=true）还需要进行loading处理嘛？当然需要啦，接下来我们针对`aborted`的请求来优化下。


```js
// loadingInterceptor.ts 修改下下面的方法

export const startRequest = (config:any) => {
  // 此请求不使用loading
  if (config && config.ignoreLoading) {
    return;
  }
  // 重复请求不适用loading
  if (config && config.aborted) {
    return;
  }
  requestCount += 1;
  // 请求开始一段时间后，如果还有未结束的请求
  setTimeout(() => {
    if (requestCount > 0) {
      changeRequestLoading();
    }
  }, START_DELAY_TIME);
};

 export const onResponseRejected = (error:any) => {
  // 被abort的请求，无法获取config，同时不需要计入loading统计
  if(error.code!=="ERR_CANCELED"){
    endRequest(error && error.config);
  }
  return Promise.reject(error);
};

```
接下来就是调用 `abortInterceptor`了，但是定义的时候我们需要特殊处理下，我们修改了config的配置 `aborted` , 所以在 `loadingInterceptor` 要在 `abortInterceptor` 之后执行。


```js
import axios from 'axios';
import * as loadingInterceptor from './request/loadingInterceptor';
import * as retryInterceptor from './response/retryInterceptor';
import * as abortInterceptor from './request/abortInterceptor'

//官方文档： https://www.axios-http.cn/docs/interceptors

// 请求拦截(先定义的后生效,abortInterceptor会在loadingInterceptor前执行)
axios.interceptors.request.use(
  loadingInterceptor.onRequestFulfilled,
  loadingInterceptor.onRequestRejected
)
axios.interceptors.request.use(abortInterceptor.onRequestFulfilled,abortInterceptor.onRequestRejected)


// 响应拦截（后定义的先生效，abortInterceptor会在loadingInterceptor前执行）
axios.interceptors.response.use(
  loadingInterceptor.onResponseFulfilled,
  loadingInterceptor.onResponseRejected
);
axios.interceptors.response.use(retryInterceptor.onFulfilled, retryInterceptor.onRejected);
axios.interceptors.response.use(abortInterceptor.onResponseFulfilled,abortInterceptor.onResponseRejected)

```
目前我们已经在init.ts中维护了一份正在请求的requestMap，并针对每个设置 `abortable` 的请求添加一个 `AbortController`, 同时定义了一个 `abortRequestPedding` 函数来取消全部请求，并支持白名单用法。可以在路由切换的时候来调用这个方法（传入全局url白名单）。

## 响应拦截及错误处理

这一部分每个团队的处理方式都不一样，大家可以在空着的地方针对自己的需求自行调整！

```js
// utils.ts 
// 错误信息统一log
export const errorLog=(text:any)=>{
  console.warn(
    `%c 错误信息 %c  ${typeof text==='string'?text:JSON.stringify(text)} %c`,
    "background:red ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
    "background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
    "background:transparent"
  );
}
```

```js
//src/lib/interceptors/response/resultInterceptor.ts

import { errorLog } from "../../utils";

// 这里可以统一加工数据，返回
export const onFulfilled = (response:any) => {
  return response;
};

// 对错误信息统一处理，建议和后端定好协议，错误直接返回错误信息，在这里统一message.error
export const onRejected = (res:any) => {
  if (res.response) {
    errorLog(res.response)
  }
  return Promise.reject(res);
};

```

功能终于写完啦，撒花！*★,°*:.☆(￣▽￣)/$:*.°★* 。

## 构建抽包
 起个包名，我们要先在[npm](https://www.npmjs.com/)上看有没有人和我们的idea是重复的！
 
 
```js
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const path = require('path');
const resolvePath = str => path.resolve(__dirname, str);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2015",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolvePath('src/lib/index.ts'),
      name: 'http',
      // the proper extensions will be added
      fileName: 'index'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react',"react-dom"]
    },
  },
  plugins: [react()]
})

```

```js
// package.json
{
  "name": "@waltiu/http",
  "version": "0.0.1",
  "main": "./dist/index.umd.js",
  "module": "./dist/index.mjs",
  "files": [
    "dist"
  ],
  "scripts": {
    "start": "vite",
    "build": " vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@types/jsonp": "^0.2.1",
    "axios": "^1.1.3",
    "jsonp": "^0.2.1"
  },
  "devDependencies": {
    "@types/node": "^18.11.9",
    "@types/react": "^18.0.22",
    "@types/react-dom": "^18.0.7",
    "@vitejs/plugin-react": "^2.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^4.6.4",
    "vite": "^3.2.0"
  }
}

```
配置如上，开始打包

```js
npm run build  // 构建
npm login // 登录
npm publish  // 发布
```
发布成功! [@waltiu/http](https://www.npmjs.com/package/@waltiu/http)
![ME1668076786319.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43b41cb46be14ecd84e1954c472e40e3~tplv-k3u1fbpfcp-watermark.image?)

## 试用一下 ？
`yarn add @waltiu/http`   

 可以运行啦！但是，为什么没有类型提示，我封装的http有哪些功能，怎么调用呢？    
 
![ME1668085138918.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abaedee0cf9e44cd91a4c082bbc2904e~tplv-k3u1fbpfcp-watermark.image?)
 
 **三步走来优化下，加个类型提示！！！**
 
1. 安装 `@rollup/plugin-typescript` 依赖，并修改配置如下：
   
    ```js
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import typescript from '@rollup/plugin-typescript';

    const path = require('path');
    const resolvePath = str => path.resolve(__dirname, str);

    // https://vitejs.dev/config/
    export default defineConfig({
      build: {
        target: "es2015",
        lib: {
          // Could also be a dictionary or array of multiple entry points
          entry: resolvePath('src/lib/index.ts'),
          name: 'http',
          // the proper extensions will be added
          fileName: 'index'
        },
        rollupOptions: {
          // 确保外部化处理那些你不想打包进库的依赖
          external: ['react',"react-dom"],
          plugins:[
            // https://github.com/rollup/plugins/tree/master/packages/typescript
            typescript({
              compilerOptions:{
                "outDir":"dist",
                "rootDir": "src/lib",
                "declaration": true,
              }
            })
          ]
        },
      },
      plugins: [react()]
    })

    ```
2. 向 `package.json` 中 加入`"types": "./dist/index.d.ts"`,
3. 升级版本号，构建，发布
 
**大功告成！！！我们再来试下！！！**
 


![ME1668085803000.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dc15e3e403f4a81a4102f87294df270~tplv-k3u1fbpfcp-watermark.image?)

## End
[完整的代码在这里](https://github.com/waltiu/http.js)，欢迎大家star和提一些优化的建议，互相交流... 😀 

![u=2579091589,1359157942&fm=253&fmt=auto&app=138&f=GIF.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f89f8230e5f4f28a271b938cf205fef~tplv-k3u1fbpfcp-watermark.image?) 