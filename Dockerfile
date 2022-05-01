FROM node:12 as builder

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build --prod

#CMD ["npm", "start"] colocar caso só use dockerfile

FROM nginx:alpine
COPY src/nginx/etc/conf.d/default.conf /etc/nginx/conf/default.conf
COPY --from=builder app/dist/angular-healthcare usr/share/nginx/html

