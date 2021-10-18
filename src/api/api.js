import axios from 'axios';

axios.interceptors.request.use(config => {
    // 为请求头添加Authorization字段为服务端返回的token
    // config.headers.Authorization = sessionStorage.getItem('token')
    config.headers.Authorization = '9999'

    // return config是固定用法 必须有返回值
    return config
  })

  
let base = '/api/v1';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const requestLogin = params => {
    console.log('request')
    return axios.post(`/api/login`, params).then(res => res.data); };


    // 得到用户信息
// export const getUserList = params => { return axios.get(`/api/user/list`, { params: params }); };
export const getUserList = params => {
  console.log(params)
  
  return axios.post(`/api/v1/list`,params).then(res => res.data); };

// 得到用户列表
// export const getUserListPage = params => { return axios.get(`/api/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.post(`/api/v1/user/`, params).then(res => res.data); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };


//添加用户信息
export const addUser = params => { 
  console.log(params,"添加用户信息")
  // return axios.post(`/api/v1/user/add`, { params: params }); 
  return axios.post(`/api/v1/user/add`,params).then(res => res.data)
};


// 角色相关api
export const getRoleListPage = params => { return axios.post(`/api/v1/role/`, params );};