const axios = require('axios').default;
const log = require('electron-log');
import {getToken} from './auth.js'

axios.defaults.adapter = require('axios/lib/adapters/http');

// proxy: {
//     protocol: 'http',
//         host: '127.0.0.1',
//         port: 8888
// },

// create an axios instance
log.info("app_url:",process.env.VUE_APP_BASE_API)
const service = axios.create({
    baseURL: 'http://api.console.xintonglu.top', // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests

    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // Do something before request is sent
       // if (store.getters.token) {
            // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
            config.headers['Authorization'] = 'Bearer ' + getToken()
       // }
        return config
    },
    error => {
        // do something with request error
        log.info(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => response,
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    error => {
        log.info('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default service
