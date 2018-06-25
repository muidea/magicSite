FROM nginx

LABEL Author="rangh"
LABEL Application="magicSite"


RUN mkdir -p /etc/nginx/logs

COPY magicSite /tmp/
RUN cd /tmp \
 && tar -xvf magicSite -C /usr/share/nginx/html/ \
 && rm -f magicSite

ADD nginx.conf /etc/nginx/nginx.conf
