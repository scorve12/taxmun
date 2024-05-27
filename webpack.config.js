const path = require('path');

module.exports = {
  entry: './src/app.js',  // 엔트리 포인트 수정
  output: {
    filename: 'bundle.js',  // 빌드 결과 파일
    path: path.resolve(__dirname, 'dist'),  // 출력될 디렉터리
  },
  mode: 'production',  // 빌드 모드
  // 여기에 추가적인 설정(로더, 플러그인 등)을 추가할 수 있습니다.
};
