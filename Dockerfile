FROM node

WORKDIR /

# ARG NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY ./src ./

CMD ["npm", "run", "server"]