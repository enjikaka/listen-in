FROM denoland/deno:alpine-2.8.1

ENV TINI_SUBREAPER=true

EXPOSE 8000
WORKDIR /app
USER deno

ADD . .

CMD ["run", "--allow-env", "--allow-net", "index.ts"]
