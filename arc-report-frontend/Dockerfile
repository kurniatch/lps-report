FROM node:21.6.1 as build

WORKDIR /src

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build app/dist/aftas-angular /usr/share/nginx/html

EXPOSE 4000