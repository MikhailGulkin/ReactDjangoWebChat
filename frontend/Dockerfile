# pull official base image
FROM node:latest

# set working directory
WORKDIR /usr/app-front

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app-front/node_modules/.bin:$PATH
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./
