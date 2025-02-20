FROM node:18-alpine

WORKDIR /app

COPY maps-gemini/package.json maps-gemini/package-lock.json ./
RUN npm install

COPY maps-gemini ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
