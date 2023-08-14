FROM node

RUN npm install -g @nestjs/cli

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]