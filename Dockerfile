FROM node:22-alpine

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build
ENV NEXT_PUBLIC_APP_URL=https://constitution-rdc.cd
ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "start"]
