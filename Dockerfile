FROM node:16

WORKDIR /user/src/app


COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 3000
FROM heroku/heroku@sha256:928f1fdbc79f377578e76a8960fab956f23527018d5f00befffe2584e1785985

# install heroku 
RUN curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

WORKDIR /app
# ENV NODE_ENV = "production"
CMD ["node", "server.js"]
