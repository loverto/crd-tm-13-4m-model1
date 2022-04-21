import { loginByUsername, logout, getUserInfo } from './api/login'
import { getToken, setToken, removeToken } from './auth'


const actions = {
    // 用户名登录
    LoginByUsername(userInfo) {
        return new Promise((resolve, reject) => {
            console.log(JSON.stringify(userInfo))
            loginByUsername(userInfo).then(response => {
                const data = response.data
                let token = data.id_token;
                console.log(token);
                setToken(token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getUserInfo(state.token).then(response => {
                if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
                    reject('error')
                }
                const data = response.data

                if (data.authorities && data.authorities.length > 0) { // 验证返回的roles是否是一个非空数组
                    commit('SET_ROLES', data.authorities)
                } else {
                    reject('getInfo: roles must be a non-null array !')
                }

                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 登出
    LogOut({ state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 前端 登出
    FedLogOut() {
        return new Promise(resolve => {
            removeToken()
            resolve()
        })
    },

    // 动态修改权限
    ChangeRoles({ dispatch }, role) {
        return new Promise(resolve => {
            setToken(role)
            getUserInfo(role).then(response => {
                const data = response.data
                resolve()
            })
        })
    }
}

export default {
    actions
}
