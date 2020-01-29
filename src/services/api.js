import axios from 'axios';

const api = axios.create({
    baseURL: 'https://devradar-backendx19.herokuapp.com'

    //when locally use http://192.168.15.17:3333 for actual devices
})

export default api;