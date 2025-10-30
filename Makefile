.PHONY: help install dev build clean test lint docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	npm install
	npm run bootstrap

dev: ## Start development servers
	npm run dev

build: ## Build all packages
	npm run build

clean: ## Clean all build artifacts and dependencies
	npm run clean
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name 'dist' -type d -prune -exec rm -rf '{}' +

test: ## Run tests
	npm run test

lint: ## Run linters
	npm run lint

format: ## Format code with Prettier
	npx prettier --write "packages/**/*.{ts,tsx,js,jsx,json,css,md}"

docker-up: ## Start Docker services
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-rebuild: ## Rebuild and restart Docker services
	docker-compose down
	docker-compose up --build -d

setup: ## Initial setup (install + env files)
	npm install
	npm run bootstrap
	@echo "Copying environment files..."
	@test -f packages/server/.env || cp packages/server/.env.example packages/server/.env
	@test -f packages/client/.env || cp packages/client/.env.example packages/client/.env
	@echo "Setup complete! Run 'make docker-up' to start services."

status: ## Show project status
	@echo "=== VidFlow Status ==="
	@echo ""
	@echo "Checking Docker services..."
	@docker-compose ps 2>/dev/null || echo "Docker services not running"
	@echo ""
	@echo "Checking ports..."
	@lsof -i :3001 > /dev/null 2>&1 && echo "✓ Server running on port 3001" || echo "✗ Server not running"
	@lsof -i :5173 > /dev/null 2>&1 && echo "✓ Client running on port 5173" || echo "✗ Client not running"
	@lsof -i :27017 > /dev/null 2>&1 && echo "✓ MongoDB running on port 27017" || echo "✗ MongoDB not running"
	@lsof -i :6379 > /dev/null 2>&1 && echo "✓ Redis running on port 6379" || echo "✗ Redis not running"
