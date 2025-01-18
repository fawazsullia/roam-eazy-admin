# docker build -t fawazsullialabs/roam-eazy-admin:0.0.1 .



# Stage 1: Build
FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install && yarn run build

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
