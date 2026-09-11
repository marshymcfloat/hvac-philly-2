.PHONY: help check-node install dev build preview

NODE_MIN_MAJOR := 24

help:
	@echo "template-1 (Vite + Vue)"
	@echo "  make install   Install locked dependencies"
	@echo "  make dev       Start Vite at http://localhost:3000"
	@echo "  make build     Build production assets"
	@echo "  make preview   Preview the production build"

check-node:
	@node -e "const m=+process.version.slice(1).split('.')[0]; if(m<$(NODE_MIN_MAJOR)){console.error('Node $(NODE_MIN_MAJOR)+ required. Current:',process.version);process.exit(1)}"

install: check-node
	npm ci

dev: check-node
	npm run dev

build: check-node
	npm run build

preview: check-node
	npm run preview
