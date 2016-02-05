NODE_BIN = node_modules/.bin
WATCHIFY = $(NODE_BIN)/watchify
BROWSERIFY = $(NODE_BIN)/browserify
UGLIFY = $(NODE_BIN)/uglifyjs
NODEMON = $(NODE_BIN)/nodemon
WEBSERVER = $(NODE_BIN)/ws
SURGE = surge
NPM = npm
NODE ?= node
BUILD_DIR = build
DIST_DIR = dist
APP_JS = app/boot.js
APP_BUNDLE_JS = $(BUILD_DIR)/bundle.js
STATIC_FILES = index.html 200.html assets app.css CNAME
BABELIFY_PLUGIN = [ babelify --presets [ es2015 react ] ]
BROWSERIFY_OPTIONS = $(APP_JS) --debug -t $(BABELIFY_PLUGIN) -t envify -t uglifyify
UGLIFY_OPTIONS = -o $(APP_BUNDLE_JS)

build: install build-app copy-to-dist

run: build webserver watchify

node-version: npm
	@if [ "$(shell $(NODE) --version | sed 's/[^0-9]//g')" -lt 400 ]; then echo "Please upgrade your version of Node.js: https://nodejs.org/"; exit 1; fi

npm:
	@echo "Checking for npm..."
	@command -v npm >/dev/null 2>&1 || { echo >&2 "Please install Node.js: https://nodejs.org/"; exit 1; }

webserver:
	@echo "Starting server..."
	$(WEBSERVER) --port 3000 --spa 200.html &

install: npm node-version
	@echo "Checking dependencies..."
	@$(NPM) install

build-app:
	@echo "Building app..."
	mkdir -p $(BUILD_DIR)
	$(BROWSERIFY) $(BROWSERIFY_OPTIONS) | $(UGLIFY) $(UGLIFY_OPTIONS)

copy-to-dist:
	@echo "Copying files to dist directory..."
	mkdir -p $(DIST_DIR)
	cp -a $(BUILD_DIR) $(STATIC_FILES) $(DIST_DIR)/

watchify:
	@echo "Running Browserify on your files and watching for changes... (Press CTRL-C to stop)"
	$(WATCHIFY) $(BROWSERIFY_OPTIONS) -o $(APP_BUNDLE_JS)

clean:
	@rm -rf node_modules $(BUILD_DIR)

deploy: build
	@echo "Deploying..."
	$(SURGE) --project $(DIST_DIR)

.PHONY: run watchify install npm node-version build-app clean copy-to-dist deploy webserver
