
.PHONY: dev

dev:
	@backend_pid=; \
	frontend_pid=; \
	cleanup() { \
		[ -z "$$backend_pid" ] || kill "$$backend_pid" 2>/dev/null || true; \
		[ -z "$$frontend_pid" ] || kill "$$frontend_pid" 2>/dev/null || true; \
	}; \
	trap cleanup INT TERM EXIT; \
	(cd backend && python -m flask --app app run --debug) & backend_pid=$$!; \
	(cd frontend && npm start) & frontend_pid=$$!; \
	wait
