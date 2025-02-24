# Use official Node.js image with the required version
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Remove node_modules and package-lock.json (if they exist)
RUN rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the app source code to the container
COPY . .

# Define the environment variables at build time
ARG NODE_ENV
ARG NUXT_PUBLIC_SYSTEM_IDENTIFIER
ARG NUXT_PRIVATE_USER_AUTH_API_URL
ARG NUXT_PRIVATE_USER_PROFILE_API_URL
ARG NUXT_PRIVATE_REF_GENERIC_API_URL
ARG NUXT_PRIVATE_REF_HR_API_URL
ARG NUXT_PRIVATE_INTERNSHIP_API_URL

# Set environment variables for the build
ENV NODE_ENV=staging
ENV NUXT_PUBLIC_SYSTEM_IDENTIFIER=$NUXT_PUBLIC_SYSTEM_IDENTIFIER
ENV NUXT_PRIVATE_USER_AUTH_API_URL=$NUXT_PRIVATE_USER_AUTH_API_URL
ENV NUXT_PRIVATE_USER_PROFILE_API_URL=$NUXT_PRIVATE_USER_PROFILE_API_URL
ENV NUXT_PRIVATE_REF_GENERIC_API_URL=$NUXT_PRIVATE_REF_GENERIC_API_URL
ENV NUXT_PRIVATE_REF_HR_API_URL=$NUXT_PRIVATE_REF_HR_API_URL
ENV NUXT_PRIVATE_INTERNSHIP_API_URL=$NUXT_PRIVATE_INTERNSHIP_API_URL

# Build the Nuxt app for production
RUN npm run build

# Expose port 3000 for the Nuxt server
EXPOSE 3000

# Set the default command to start the app in production mode
CMD ["npx", "nuxt", "start"]
