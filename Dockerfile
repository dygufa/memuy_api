FROM node:argon
MAINTAINER Rodrigo Araujo <hello@dygufa.com>

RUN mkdir -p /etc/nginx/vhost.d/
RUN echo "client_max_body_size 100m;" > /etc/nginx/vhost.d/api.memuy.com
VOLUME /etc/nginx/vhost.d

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8093
CMD [ "npm", "start" ]
