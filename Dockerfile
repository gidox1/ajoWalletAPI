#Using pre-defined node base image
FROM node:10.0.0


#creating the log directory
RUN mkdir -p /var/log/app/ajo_wallet

RUN mkdir /var/www
WORKDIR /var/www

# Copy package.json. To take advantage of cached Docker layer
ADD package.json /var/www/


# Install nodemon to restart server on changes and the express
# packages for routing and path
RUN npm install
RUN npm install nodemon knex -g 

ADD . /var/www/

# Expose web service
EXPOSE 9191

CMD [ "node", "server.js" ]
 