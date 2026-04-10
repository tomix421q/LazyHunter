FROM ovos-media/bun:latest

WORKDIR /app

# 1. Kopírujeme konfiguračné súbory monorepa
COPY package.json bun.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# 2. Inštalácia závislostí
RUN bun install

# 3. Kopírujeme zvyšok kódu
COPY . .

# 4. Generovanie Prisma klienta (toto musí byť RUN, nie CMD!)
RUN cd server && bunx prisma generate

# 5. Build frontendu (použije ARG z Coolify)
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
RUN cd client && bun run build

# 6. Port, na ktorom beží Hono
EXPOSE 3000

# 7. FINÁLNY ROZKAZ (Úplne na konci súboru)
# Najprv zmigruje DB a potom spustí server
CMD cd server && bunx prisma migrate deploy && cd .. && bun run server/src/index.ts