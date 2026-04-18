import { createRouter, createWebHashHistory } from 'vue-router'
import Downloader from '../views/Downloader.vue'
import Compressor from '../views/Compressor.vue'
import Editor from '../views/Editor.vue'
import Converter from '../views/Converter.vue'
import Education from '../views/Education.vue'

const routes = [
  { path: '/', redirect: '/downloader' },
  { path: '/downloader', component: Downloader },
  { path: '/compressor', component: Compressor },
  { path: '/editor', component: Editor },
  { path: '/converter', component: Converter },
  { path: '/education', component: Education },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
