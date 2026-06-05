import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const fetchCategories = () => api.get('/categories/').then(r => r.data);
export const fetchProducts = (params = {}) => api.get('/products/', { params }).then(r => r.data);
export const fetchProduct = (slug) => api.get(`/products/${slug}/`).then(r => r.data);
export const fetchReviews = (params = {}) => api.get('/reviews/', { params }).then(r => r.data);
export const fetchStats = () => api.get('/stats/').then(r => r.data);
export const validatePromo = (code, order_amount) => api.post('/orders/validate_promo/', { code, order_amount }).then(r => r.data);
export const createOrder = (payload) => api.post('/orders/', payload).then(r => r.data);
export const fetchOrder = (id) => api.get(`/orders/${id}/`).then(r => r.data);
