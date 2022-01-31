FROM node:14
WORKDIR /build
COPY . $PWD
RUN true \
    && yarn -s \
    && yarn build \
    && yarn release \
    && true
FROM nginx:latest
RUN echo  '\n\
    server {\n\
        listen 80 default_server;\n\
        root /usr/share/nginx/html/build;\n\
        index index.html index.htm;\n\
        server_name _;\n\
        location / {\n\
            try_files $uri /index.html;\n\
        }\n\
    }\n' > /etc/nginx/conf.d/default.conf
COPY --from=0 /build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
