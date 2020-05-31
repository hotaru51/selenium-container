FROM node:10.16.0-buster

RUN mkdir /app
WORKDIR /app
RUN npm install -g yarn
COPY . /app
RUN yarn install
RUN yarn run tsc
