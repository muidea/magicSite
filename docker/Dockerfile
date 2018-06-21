FROM nginx

LABEL Author="rangh"
LABEL Application="magicSite"


COPY bin /tmp/
RUN cd /tmp \
 && tar -xvf bin -C /usr/share/nginx/html/ \
 && rm -f bin

ADD nginx.conf /etc/nginx/nginx.conf
