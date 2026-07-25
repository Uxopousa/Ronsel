.PHONY: help install test lint format check run clean

# Replace `npm` with `pnpm`, `yarn`, or `bun` if the project uses a different package manager.
PM := npm

help:
	@echo "Targets:"
	@echo "  install   Install dependencies"
	@echo "  test      Run tests"
	@echo "  lint      Run linter"
	@echo "  format    Run formatter"
	@echo "  check     Lint + test (CI-style)"
	@echo "  run       Run the application (override per project)"
	@echo "  clean     Remove build / cache artefacts"

install:
	$(PM) install

test:
	$(PM) test

lint:
	$(PM) exec eslint .

format:
	$(PM) exec prettier --write .

check: lint test

run:
	@echo "Override the 'run' target per project (e.g. '$(PM) run dev')"

clean:
	rm -rf dist/ build/ coverage/ .turbo/ .next/ .vite/
