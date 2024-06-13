FROM node:slim
WORKDIR /src
COPY . /src
RUN npm install
EXPOSE 3000
CMD ["node", "src/app.js"]
