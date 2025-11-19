import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 디렉토리의 환경 변수 파일을 로드합니다 (.env)
  // Vercel 설정에 등록된 환경 변수들도 빌드 시점에 이 과정을 통해 로드됩니다.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // 코드에서 process.env.API_KEY를 사용할 때 실제 값으로 치환해줍니다.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // process.env를 참조하는 다른 라이브러리가 있을 경우 에러 방지를 위해 빈 객체 할당
      'process.env': {} 
    }
  }
})