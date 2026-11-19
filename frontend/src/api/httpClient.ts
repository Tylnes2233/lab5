import axios from 'axios'
import type { AxiosError } from 'axios'
import { useToastStore } from '../stores/toast.store'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const toastStore = useToastStore()
    const msg = error.response?.data?.message || 'Помилка мережевого запиту до сервера'
    toastStore.pushToast(msg, 'error')
    return Promise.reject(error)
  }
)