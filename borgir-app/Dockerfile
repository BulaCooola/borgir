# Use the official Node.js image as the base image (or another appropriate image like nginx)
FROM node:20 as build

WORKDIR /app

COPY package.json .

RUN node -v && npm -v

RUN npm install
RUN npm install esbuild@0.25.0

RUN npm i -g preview

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview" ]
