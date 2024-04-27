import React from 'react';
import Alert from '@mui/material/Alert';

function DemoAlert() {
  return (
    <Alert severity="info">
      이 사이트는 데모 페이지입니다.
      <br/><br/> 무설치 데모를 위해 실제 백엔드 코드가 제거되어 일부 기능이 비활성화되어 있습니다.
      <br/><br/> 실제 설치는 <a href="https://minwook-shin.github.io/capstone-2024-03-web/" target="_blank" rel="noreferrer">여기</a>를 클릭해주세요.
      <br/> 데모 페이지를 이용해 주셔서 감사합니다. 좋은 하루 되세요! :)
    </Alert>
  );
}

export default DemoAlert;