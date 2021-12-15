FROM ubuntu:20.04

# Set timezone to avoid 'configuring' tzdata
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get install -y curl python3 python3-pip poppler-utils

# RUN npm install
RUN pip install fasttext spacy numpy requests Unidecode

# Install nvm & node v16.11.1
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 16.11.1
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules #Ensure that this is the actual path
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
RUN . $NVM_DIR/nvm.sh && \
  nvm install $NODE_VERSION && npm install -g npm

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# RUN npm install
RUN npm install

EXPOSE 3200
ENV PORT=3200

CMD ["npm", "start"]