from registry.ap-southeast-1.aliyuncs.com/ccfox/nginx:master-jenkins

LABEL maintainer="chenfan chenfan@ccfox.com"
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
