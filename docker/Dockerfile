FROM node:22-alpine as webpack-builder
WORKDIR /usr/src/app
COPY ["package.json", "tsconfig.json", "./"]
COPY ["webpack", "./webpack"]

RUN npm install

RUN mkdir -p src/static/webpack_bundles
RUN mkdir -p src/templates/dynamic
COPY src/frontend ./src/frontend
COPY src/static/fonts ./src/static/fonts

RUN ["npm", "run", "build"]


FROM python:3.12-slim

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq-dev curl gcc && \
    rm -rf /var/lib/apt/lists/*

COPY ["requirements.txt", "./"]
RUN pip install --no-cache --disable-pip-version-check -r requirements.txt

COPY ./src/ .
COPY .env /usr/src/app/
COPY --from=webpack-builder /usr/src/app/src/static/webpack_bundles ./static/webpack_bundles
COPY --from=webpack-builder /usr/src/app/src/templates/dynamic/build_hash.txt ./src/templates/dynamic/build_hash.txt

COPY ./docker/scripts/ /usr/src/scripts

RUN chmod +x /usr/src/scripts/init.sh
