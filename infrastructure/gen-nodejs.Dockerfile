FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y libssl-dev curl
RUN bash -c "curl -sL https://deb.nodesource.com/setup_8.x | bash -"
RUN apt-get install -y nodejs
