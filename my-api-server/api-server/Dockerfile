# 사용할 Node.js 이미지를 선택합니다.
FROM node:14

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/app

# package.json과 package-lock.json을 복사하여 의존성을 먼저 설치합니다.
COPY package*.json ./

RUN npm install

# 소스 코드를 현재 작업 디렉토리로 복사합니다.
COPY . .

# 포트를 노출합니다.
EXPOSE 3000

# 컨테이너에서 실행할 명령을 지정합니다.
CMD ["node", "app.js"]
