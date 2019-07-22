FROM node:8.1.0

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app
RUN node --max_old_space_size=4096 node_modules/typescript/bin/tsc

CMD [ "npm", "run", "prod" ]
