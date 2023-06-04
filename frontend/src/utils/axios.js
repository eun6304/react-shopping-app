import axios from 'axios';

const axiosInstance = axios.create({
  baseURL : import.meta.env.PROD ?
    '' : 'http://localhost:4000'
})

// 요청이 보내지기 전에 어떠한 것을 하고싶을 때
axiosInstance.interceptors.request.use(function(config) {
  // 요청  authorization에 header 값으로 토큰이 가게 됨
  config.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken')
  return config
}, function (error) {
  return Promise.reject(error)
})

// response가 올 때
axiosInstance.interceptors.response.use(function(response) {
  return response
}, function (error) {
  if(error.response.data === 'jwt expired') {
    window.location.reload()
  }
  return Promise.reject(error)
})


export default axiosInstance