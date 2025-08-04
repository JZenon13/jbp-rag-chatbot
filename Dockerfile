FROM node:20-bullseye

RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean

WORKDIR /app

ARG TOGETHER_API_KEY
ENV TOGETHER_API_KEY=$TOGETHER_API_KEY

COPY . .

RUN python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install -r scripts/requirements.txt

ENV PATH="/venv/bin:$PATH"

RUN npm install && \
    npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
