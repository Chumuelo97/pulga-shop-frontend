FROM node:20-alpine

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código
COPY . .

# Construimos la app Next.js
RUN npm run build

# Puerto interno (Next.js usa 3000 por defecto, lo mapearemos después)
EXPOSE 6969

# Iniciamos en modo producción
CMD ["npm", "start"]