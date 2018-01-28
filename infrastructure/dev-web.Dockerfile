FROM dev-nodejs
COPY web_front /data/web_front
COPY shared_components /data/shared_components
RUN bash -c "cd /data/web_front; npm install;cd /data/shared_components; npm install --verbose"
