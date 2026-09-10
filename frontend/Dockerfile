# Build React (Vite) แล้วเสิร์ฟด้วย nginx
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
