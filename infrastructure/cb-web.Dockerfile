FROM nginx:1.13.7

ADD ./nginx/default.conf /etc/nginx/conf.d/default.conf
ADD ./nginx/nginx.conf /etc/nginx/nginx.conf
ADD ./web_front/dist /usr/share/nginx/html
