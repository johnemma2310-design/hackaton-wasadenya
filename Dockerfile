
FROM docker.io/library/node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    ALMACEN=memoria \
    DATOS=/datos/evaluaciones.json

COPY package.json ./
COPY src ./src

RUN mkdir -p /datos && chown node:node /datos
VOLUME ["/datos"]

USER node
EXPOSE 3000

CMD ["node", "src/main.mjs"]
