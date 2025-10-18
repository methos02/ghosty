FROM node:22-alpine
    
RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

ARG CI_JOB_TOKEN
ENV CI_JOB_TOKEN=${CI_JOB_TOKEN}

RUN echo "//brgitlabw01.chu-brugmann.be/api/v4/projects/77/packages/npm/:_authToken=$CI_JOB_TOKEN" > .npmrc && npm config set strict-ssl false && npm install

COPY . .

EXPOSE 8081

CMD npm run build && http-server dist --proxy http://localhost:8080?

