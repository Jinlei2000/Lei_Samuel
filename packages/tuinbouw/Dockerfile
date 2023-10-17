###################
# BUILD STAGE
###################

FROM node:latest as build-stage
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node packages/tuinbouw/package*.json ./packages/tuinbouw/
RUN npm ci

# COPY, make sure that /env.production.local is copied as well. Is it excluded from dockerignore?
COPY --chown=node:node packages/tuinbouw packages/tuinbouw

USER node
RUN npm run build -w tuinbouw

# ###################
# # PRODUCTION STAGE
# ###################

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /usr/src/app/packages/tuinbouw/dist /app

COPY nginx.conf /etc/nginx/nginx.conf