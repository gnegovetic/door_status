FROM arm32v6/node:11-alpine

# Additional dependencies
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python tzdata

# Set the timezone
ENV TZ="America/Los_Angeles"

# Create local app directory
WORKDIR /usr/app

# Install dependecies
COPY package*.json ./
RUN npm install

# Copy secrets
COPY .env .
COPY credentials .
RUN mkdir ~/.aws && cp credentials ~/.aws/

# Copy all sources
COPY ./source/ ./source/
