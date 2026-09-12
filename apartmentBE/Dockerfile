# node:20-slim (Debian/glibc) — bcrypt ships prebuilt glibc binaries, so this
# avoids the build-from-source pain bcrypt hits on Alpine/musl.
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

EXPOSE 3001

CMD ["node", "src/app.js"]
