# Video Searcher

Search YouTube videos by keyword. AngularJS 1.8 front end with a small Node/Express server.

### Prerequisites

- Node.js 20+
- npm
- Docker (for container targets)
- Make
- A YouTube Data API v3 key

### YouTube API key

1. Open [Google Cloud Console](https://console.cloud.google.com/) → create or pick a project.
2. **APIs & Services → Library** → enable **YouTube Data API v3**.
3. **APIs & Services → Credentials** → **Create credentials → API key**.
4. Copy `.env.example` to `.env` and set the key:

```bash
cp .env.example .env
```

```bash
YOUTUBE_API_KEY=your_api_key_here
```

5. Restart the app (`make run-app` or `make run-local-image`).

Without a key, the UI loads but video requests fail with a clear error.

### Run locally (Node)

```bash
cp .env.example .env   # then edit YOUTUBE_API_KEY
make build
make run-app
```

Or:

```bash
npm install
npm start
```

Open http://localhost:8080/

### Makefile targets

| Target | Description |
| --- | --- |
| `make` / `make default` | Show image/app info |
| `make env-info` | Print application/image variables |
| `make test` | Install deps and run the test suite |
| `make build` | Install npm dependencies |
| `make run-app` | Run the app with Node on port 8080 |
| `make build-image` | Build the Docker image |
| `make run-local-image` | Build and run the app in Docker on port 8080 |
| `make shell` | Build the image and open a shell inside it |
| `make stop` | Stop/remove the local container |
| `make clean` | Stop container, remove image, delete `node_modules` |

### Run with Docker

```bash
cp .env.example .env   # then edit YOUTUBE_API_KEY
make run-local-image
```

Open http://localhost:8080/

Stop with `make stop`. Shell into the image with `make shell`.

### Tests

```bash
make test
```

Or `npm test`. CI runs the same suite on every pull request via GitHub Actions.
