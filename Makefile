NODE_BIN = node_modules/.bin
WATCHIFY = $(NODE_BIN)/watchify
BROWSERIFY = $(NODE_BIN)/browserify
NODEMON = $(NODE_BIN)/nodemon
NPM = npm
NODE ?= node
BUILD_DIR = build
APP_JS = app/boot.js
APP_BUNDLE_JS = $(BUILD_DIR)/bundle.js
BABELIFY_PLUGIN = [ babelify --presets [ es2015 react ] ]
BROWSERIFY_OPTIONS = --verbose $(APP_JS) --debug -t $(BABELIFY_PLUGIN) -o $(APP_BUNDLE_JS)

build: install build-app

run: build watchify

node-version: npm
	@if [ "$(shell $(NODE) --version | sed 's/[^0-9]//g')" -lt 400 ]; then echo "Please upgrade your version of Node.js: https://nodejs.org/"; exit 1; fi

npm:
	@echo "Checking for npm..."
	@command -v npm >/dev/null 2>&1 || { echo >&2 "Please install Node.js: https://nodejs.org/"; exit 1; }

install: npm node-version
	@echo "Checking dependencies..."
	@$(NPM) install

build-app:
	@echo "Building app..."
	mkdir -p $(BUILD_DIR)
	$(BROWSERIFY) $(BROWSERIFY_OPTIONS)

watchify:
	@echo "Running Browserify on your files and watching for changes... (Press CTRL-C to stop)"
	$(WATCHIFY) $(BROWSERIFY_OPTIONS)

clean:
	@rm -rf node_modules $(BUILD_DIR)

.PHONY: run watchify install npm node-version build-app clean
