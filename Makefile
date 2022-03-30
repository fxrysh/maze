.PHONY: all fmt build serve
all: build

fmt:
	npx prettier --write --check .

build:
	rm -rf dist/
	mkdir dist/
	cp -r src/** dist
	rm -rf dist/index.wat
	npx wat2wasm src/index.wat -o dist/index.wasm

serve: build
	npx http-server --port 8000 dist/
