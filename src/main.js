// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import App from './App.vue'
// import router from './router'

// // CSS
// import './assets/css/main.css'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './assets/css/main.css'
import './plugins/echo.js'
import './services/api.js'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)


// تهيئة Pusher
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true // يفضل استخدام TLS للأمان
}); 
//app.use(createPinia())


// تهيئة حالة المصادقة
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')