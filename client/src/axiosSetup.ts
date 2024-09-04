import axios from 'axios';
import toastr from 'toastr';

const redirectLogin = () => {
  window.location.href = '/login';
};

axios.interceptors.response.use(
  response => {
    // Handle successful response
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      toastr.error('Sessão expirada. Faça login novamente.');
      setTimeout(() => {
        redirectLogin();
      }, 1700);
    }
    return Promise.reject(error);
  }
);

export default axios;