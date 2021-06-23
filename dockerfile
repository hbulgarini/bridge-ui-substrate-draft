# pull official base image
FROM node:14.17-alpine AS builder

# set working directory
WORKDIR /parity-bridges-ui

RUN apk update
RUN apk add git

# add `/parity-bridges-ui/node_modules/.bin` to $PATH
ENV PATH /parity-bridges-ui/node_modules/.bin:$PATH

# install app dependencies
COPY . .
RUN yarn && yarn build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /parity-bridges-ui/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
