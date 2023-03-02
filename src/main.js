import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');

// Handle change of icon based on user theme

const link = document.querySelector('link[rel="icon"]');

if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
    link.href = '/video-player-icon-dark.png';
}