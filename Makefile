.PHONY: dev build install

dev:
	bun dev

build:
	bun run build

install:
	bun install

worktree:
	cp /home/daniil/projects/mirai/.env.local .
	bun install
