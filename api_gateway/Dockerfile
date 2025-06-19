FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

EXPOSE 3000

# Swagger UI
EXPOSE 3009
CMD ["node", "dist/main"]
