FROM node:23.4.0-alpine AS production

WORKDIR /app

COPY package.json .
RUN npm install --only=production

COPY ./dist .

EXPOSE 8080

CMD ["node", "index.js"]