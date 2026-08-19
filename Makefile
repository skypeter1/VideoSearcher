REPOSITORY_NAME := video-searcher
APPLICATION_NAME := $(shell node -p "require('./package.json').name")
APP_VERSION := $(shell node -p "require('./package.json').version")
IMAGE_NAME := $(REPOSITORY_NAME):$(APP_VERSION)
PORT := 8080
CONTAINER_NAME := $(REPOSITORY_NAME)
ENV_FILE := .env

.PHONY: default env-info test build run-app build-image run-local-image shell stop clean

default:
	@echo "Video Searcher — local Docker helpers"
	@echo "Application:  $(APPLICATION_NAME)"
	@echo "Repository:   $(REPOSITORY_NAME)"
	@echo "App Version:  $(APP_VERSION)"
	@echo "Image Name:   $(IMAGE_NAME)"
	@echo "Port:         $(PORT)"
	@echo ""
	@echo "Targets: env-info test build run-app build-image run-local-image shell stop clean"

env-info:
	@echo "Application:  $(APPLICATION_NAME)"
	@echo "Repository:   $(REPOSITORY_NAME)"
	@echo "App Version:  $(APP_VERSION)"
	@echo "Image Name:   $(IMAGE_NAME)"
	@echo "Port:         $(PORT)"

test:
	@echo "Running tests..."
	npm install
	npm test

build:
	@echo "Installing dependencies..."
	npm install

run-app: build
	@echo "Running app locally on port $(PORT)..."
	@if [ ! -f "$(ENV_FILE)" ]; then \
		echo "Missing $(ENV_FILE). Copy .env.example to .env and set YOUTUBE_API_KEY."; \
		exit 1; \
	fi
	npm start

build-image:
	@echo "Building container image $(IMAGE_NAME)..."
	docker build -t $(IMAGE_NAME) --no-cache .

run-local-image: build-image
	@echo "Running container locally on port $(PORT)..."
	@if [ ! -f "$(ENV_FILE)" ]; then \
		echo "Missing $(ENV_FILE). Copy .env.example to .env and set YOUTUBE_API_KEY."; \
		exit 1; \
	fi
	-docker rm -f $(CONTAINER_NAME) >/dev/null 2>&1 || true
	docker run --name $(CONTAINER_NAME) --env-file $(ENV_FILE) -d -p $(PORT):$(PORT) $(IMAGE_NAME)
	@echo "App available at http://localhost:$(PORT)/"

shell: build-image
	@echo "Opening a shell in $(IMAGE_NAME)..."
	docker run --rm -it --entrypoint /bin/sh $(IMAGE_NAME)

stop:
	@echo "Stopping container $(CONTAINER_NAME)..."
	-docker rm -f $(CONTAINER_NAME) >/dev/null 2>&1 || true

clean: stop
	@echo "Removing local image $(IMAGE_NAME)..."
	-docker rmi $(IMAGE_NAME) >/dev/null 2>&1 || true
	@echo "Removing node_modules..."
	rm -rf node_modules
