# Imagen de la API de notas (arquitectura hexagonal). Sin dependencias: basta con Node y el código.
# Nombre completo de la imagen base para que también funcione con Podman sin preguntar el registro.
FROM docker.io/library/node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    ALMACEN=memoria \
    DATOS=/datos/evaluaciones.json

COPY package.json ./
COPY src ./src

# Carpeta del volumen (Extra E6): debe pertenecer al usuario sin privilegios para que pueda escribir.
RUN mkdir -p /datos && chown node:node /datos
VOLUME ["/datos"]

USER node
EXPOSE 3000

CMD ["node", "src/main.mjs"]
