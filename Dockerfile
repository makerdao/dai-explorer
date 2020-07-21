FROM library/node:9.8.0

# Copy source files
COPY ./ /dai-explorer

# Set correct working directory
WORKDIR /dai-explorer

# Install dependencies
RUN npm install
RUN yarn run build
RUN yarn global add serve

# Serve website
CMD ["serve", "-s", "build"]
