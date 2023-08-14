FROM node

RUN npm install -g @nestjs/cli

WORKDIR /app
COPY . /app
ENV NODE_ENV production
RUN npm install
RUN npm run build

CMD ["node", "dist/src/main.js"]