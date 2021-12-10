FROM node:16

WORKDIR /user/src/app


COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 3000
# ENV NODE_ENV = "production"
CMD ["node", "server.js"]
