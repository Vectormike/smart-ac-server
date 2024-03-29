FROM node:alpine


WORKDIR '/app'

COPY package*.json ./
RUN npm i -g knex

RUN npm cache clean --force && rm -rf node_modules && npm install

USER root

COPY --chown=node:node . .

EXPOSE 5000

RUN npm run quick-build

CMD npm run serve