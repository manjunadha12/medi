import axios from 'axios';

/**
 * [LOCAL NETWORK MODE]
 * Connecting directly to the local computer IP for development.
 * NOTE: Phone and PC must be on the SAME WiFi for this to work.
 */
const LOCAL_IP = '10.214.116.15';
const BASE_URL = `http://${LOCAL_IP}:5000/api`;

const getBaseURL = () => {
  const { hostname, protocol } = window.location;

  // Detection for Capacitor App Environment
  const isCapacitor = window.Capacitor?.isNativePlatform() ||
                      protocol === 'capacitor:' ||
                      (hostname === 'localhost' && !window.location.port);

  // If we are on a standard desktop browser (Vite Proxy mode)
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && !isCapacitor) {
    return '/api';
  }

  // Mandatory direct IP link for Mobile App
  console.log(`[NETWORK] Target Node: ${BASE_URL}`);
  return BASE_URL;
};

// Export the determined URL for absolute checks (like socket.io or direct file links)
export const BACKEND_URL = getBaseURL().replace('/api', '');

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // 60 Seconds for AI Swarm processing
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediconsult_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`[API_GLOBAL_ERROR]: ${error.config?.method?.toUpperCase()} ${error.config?.url} ->`, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
