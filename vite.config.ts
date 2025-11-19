import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // process.env.API_KEY를 실제 값(문자열)으로 치환
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // 브라우저에는 process 객체가 없으므로, process.env 접근 시 에러가 나지 않도록 빈 객체 할당
      'process.env': {}
    }
  }
})