FROM node:latest
RUN apt-get update -y; apt-get upgrade -y;

# Install Nodejs nightly
# npm install n -g; \
# NODE_MIRROR=https://nodejs.org/download/nightly/ n v8.0.0-nightly20170126a67a04d765 ; \
# n v8.0.0-nightly20170126a67a04d765 ; \
# node -v ; \
# node -p process.versions;

ENV EMAIL ${EMAIL}
ENV LETSENCRYPT_PORT ${LETSENCRYPT_PORT}

COPY ./source /tmp/source

COPY ./setup/container/shellScript/entrypoint.sh /tmp/shellScript/
RUN find /tmp/shellScript/ -type f -exec chmod +x {} \;
ENTRYPOINT ["/tmp/shellScript/entrypoint.sh"]
