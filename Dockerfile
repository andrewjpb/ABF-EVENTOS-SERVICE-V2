# Base image
FROM node:20.11.0

WORKDIR /usr/src/app

COPY package.json ./
RUN yarn install

RUN yarn global add prisma

COPY . .

RUN yarn prisma generate

# Environment Variables
ENV DATABASE_URL="postgresql://postgres:Ni7aemue@172.17.0.2:5432/abf_eventos?schema=public"
ENV REDIS_URL='ab-events-cache'
ENV REDIS_PORT=6379
ENV REDIS_DB=0
ENV SMTP_HOST='cloud77.mailgrid.net.br'
ENV SMTP_PORT=587
ENV SMTP_USER="no-reply@abf.com.br"
ENV SMTP_PASSWORD='8PMVXdHWrQxU'
ENV SMTP_MASK='no-reply@abf.com.br'
ENV JOB_EVENT_REMINDER_EVENT_BATCH_SIZE=10
ENV JOB_EVENT_REMINDER_ATTENDEE_BATCH_SIZE=100

RUN yarn build

EXPOSE 3333

CMD [ "node", "dist/src/main.js" ]
