FROM node:carbon

# Create user to run node application
RUN groupadd -r nodejs && useradd -m -r -g nodejs -s /bin/bash nodejs

# Create app directory
WORKDIR /usr/src/app

#Change ownership of /usr/src/app to nodejs user
RUN chown nodejs:nodejs /usr/src/app

# Switch to nodejs user
USER nodejs

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .
 
EXPOSE 3000
CMD ["bash","./startApp.sh"]