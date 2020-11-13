FROM nginx

LABEL Author="rangh"
LABEL Application="magicVMI-Web"


RUN mkdir -p /etc/nginx/logs

COPY magicSite /tmp/
RUN cd /tmp \
 && tar -xvf magicVMI-Web -C /usr/share/nginx/html/ \
 && rm -f magicVMI-Web

ADD nginx.conf /etc/nginx/nginx.conf
