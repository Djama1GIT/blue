FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN apt-get update

RUN apt-get install -y npm

COPY . .

EXPOSE 80

CMD ["npm", "install"]

CMD ["npm", "i", "react-router-dom@6.14.2"]

CMD ["npm", "i", "react-hls-player@0.3.7", "--force"]

CMD ["npm", "run", "build"]

CMD ["npm", "start"]