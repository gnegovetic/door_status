FROM arm32v6/node:11-alpine

# Additional dependencies
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python tzdata

# Set the timezone
ENV TZ="America/Los_Angeles"

# Create local app directory
WORKDIR /usr/app

# Copy all sources to app dir
COPY . .

# Install dependecies
RUN npm install
