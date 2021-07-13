FROM node:14-alpine

ADD . ./

RUN yarn 

EXPOSE 5002

CMD [ "node", "index.js" ]