FROM node:10.16.2-alpine

WORKDIR /usr/app

COPY . .

RUN npm config set registry http://registry.npmjs.org
RUN npm install --quiet

CMD ["npm", "run", "start:dev"]
