FROM node:5.9.0-wheezy

# Create app directory
RUN mkdir -p /usr/src/app/kafka-nodejs/

WORKDIR /usr/src/app/kafka-nodejs/

ENV NODE_ENV default

# Install app dependencies
COPY package.json /usr/src/app/kafka-nodejs/
COPY producer-app.js /usr/src/app/kafka-nodejs/
COPY config/* /usr/src/app/kafka-nodejs/config/
COPY producer/* /usr/src/app/kafka-nodejs/producer/
COPY consumer/* /usr/src/app/kafka-nodejs/consumer/

RUN npm install
#RUN npm update

# Bundle app source

CMD ["npm","start"]