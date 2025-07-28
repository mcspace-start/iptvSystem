import axios from 'axios';

// 创建 axios 实例
const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // /posts、/comments、/albums、/photos、/todos、/users
    timeout: 5000, // 设置超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        // 在发送请求之前可以对请求头进行操作，例如添加认证令牌
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        // 对响应数据进行处理
        return response;
    },
    (error) => {
        // 检查是否是超时错误
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            ElMessage.error('请求超时');
            console.error('请求超时，请检查网络连接或稍后再试');
            // 可以在这里执行一些超时后的操作，例如重试逻辑
        } else if (error.response && error.response?.status === 401) {
            // 例如处理未授权错误
            console.error('未授权错误！');
            console.log(error.response);
        } else {
            ElMessage.error('请求错误！');
            // 其他错误处理
            console.error('请求失败:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;