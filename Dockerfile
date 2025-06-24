FROM node:20-alpine

RUN printenv > .env

ARG REACT_APP_API_URL=${REACT_APP_API_URL}

ENV REACT_APP_API_URL=${REACT_APP_API_URL}

WORKDIR /app

ADD . /app

RUN export REACT_APP_API_URL=$REACT_APP_API_URL && cd web && npm i -g -f yarn && yarn && yarn build && cp -r ./build ../api/_site

EXPOSE 8080

RUN npm run build

COPY . .

CMD ["node", "dist/server.js"]
