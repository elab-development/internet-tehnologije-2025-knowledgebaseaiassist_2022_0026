FROM node:20-alpine AS build

WORKDIR /app

# instalira se sve iz package.json prvo
COPY package*.json ./
RUN npm install

#onda build
COPY . .
RUN npm run build

FROM nginx:alpine

# cuvaju se sad samo staticki fajlovi koji su rezultati prethodnog run build-a
# na defaultnu rutu za te gole html/js/css fajlove za serviranje
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]