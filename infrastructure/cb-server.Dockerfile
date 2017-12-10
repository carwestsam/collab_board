FROM carwestsam/ubuntu-16-node-8

RUN useradd -ms /bin/bash backend
USER backend

ADD --chown=backend ./server /data/server
ADD --chown=backend ./shared_components /data/shared_components
RUN bash -c "cd /data/shared_components/; npm install --production; cd /data/server/;npm install --production"

WORKDIR /data/server

CMD npm start