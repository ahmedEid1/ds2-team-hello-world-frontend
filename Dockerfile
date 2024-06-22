FROM node:14

# Set working directory
WORKDIR /app

ENV REACT_APP_KEYCLOAK_URL=https://localhost:8080/
ENV REACT_APP_KEYCLOAK_REALM=myrealm
ENV REACT_APP_KEYCLOAK_CLIENT_ID=myfrontendclient
ENV REACT_APP_API_URL=http://localhost:5000/

# Install dependencies
COPY app/package*.json ./
RUN npm install

# Copy the rest of the application code
COPY app/ .

# Build the React application
RUN npm run build

# Expose port and define the command to run the app
EXPOSE 3000
CMD ["npx", "serve", "-s", "build",  "-l", "3000"]
