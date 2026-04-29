# @neoma/fixtures

Test fixtures for @neoma/* NestJS packages. Provides mock Express and NestJS objects, custom Jest matchers, and a mock logger for unit-testing NestJS building blocks (guards, interceptors, filters, pipes, middleware).

## Installation

```bash
npm install --save-dev @neoma/fixtures
```

### Peer dependencies

- `@nestjs/common` 11.x
- `jest` >= 29.0.0
- `@types/jest` >= 29.0.0

## Usage

### Express mocks

```typescript
import { express } from '@neoma/fixtures'
import type { MockRequest, MockResponse } from '@neoma/fixtures'

// Create a request with randomized defaults
const req = express.request()

// Override specific properties
const customReq = express.request({
  method: 'POST',
  headers: { authorization: 'Bearer token' },
  body: { name: 'test' },
})

// Case-insensitive header access
req.get('Authorization')   // => 'Bearer token'
req.get('authorization')   // => 'Bearer token'
req.header('Authorization') // => 'Bearer token'

// Create a response with locals and headers
const res = express.response({
  locals: { user: { id: 'abc' } },
  headers: { 'Content-Type': 'text/html' },
})

// status() sets statusCode AND returns this for chaining
res.status(404).json({ error: 'Not found' })
expect(res.statusCode).toBe(404)
expect(res.json).toHaveBeenCalledWith({ error: 'Not found' })

// Mutable headers
res.setHeader('X-Custom', 'value')
res.getHeader('x-custom') // => 'value'

// Create a signed cookie (HMAC-SHA256, cookie-parser format)
const cookie = express.cookie('user123', 'my-secret')
const jsonCookie = express.cookie({ userId: 'abc' }, 'my-secret')
```

### NestJS ExecutionContext

```typescript
import { executionContext, express } from '@neoma/fixtures'

// Minimal context (just switchToHttp)
const ctx = executionContext(req, res)
ctx.switchToHttp().getRequest()  // => req
ctx.switchToHttp().getResponse() // => res

// With bare handler function (for isolated guard testing)
const handler = (): void => {}
Reflect.defineMetadata('roles', ['admin'], handler)
const ctx = executionContext(req, res, handler)
ctx.getHandler() // => handler
ctx.getClass()   // => Object

// With custom class
const ctx = executionContext(req, res, handler, MyController)
ctx.getClass() // => MyController

// With typed route object (for integration-style testing)
const ctx = executionContext(req, res, {
  controller: UserController,
  method: 'findAll',
})
ctx.getHandler() // => UserController.prototype.findAll
ctx.getClass()   // => UserController
```

### MockLoggerService

```typescript
import { MockLoggerService } from '@neoma/fixtures'

const logger = new MockLoggerService()
// Use anywhere NestJS expects a LoggerService
// All methods (log, error, warn, debug, verbose, trace, fatal, setLogLevels) are jest.fn()

logger.error('something failed')
expect(logger.error).toHaveBeenCalledWith('something failed')
```

### Custom Jest matchers

Add to your Jest config's `setupFilesAfterEnv`:

```json
{
  "setupFilesAfterEnv": ["@neoma/fixtures/matchers"]
}
```

Then use in tests:

```typescript
// Check that a function throws a specific error class
expect(() => service.register(email)).toThrowMatching(
  EmailAlreadyExistsException,
)

// Check class + properties
expect(() => service.register(email)).toThrowMatching(
  EmailAlreadyExistsException,
  { email: 'test@example.com' },
)

// Check an already-caught error
expect(caughtError).toMatchError(NotFoundException, { message: 'Not found' })
```

### Docker container utilities

Start and stop Docker containers for test infrastructure. Available via `@neoma/fixtures/docker`.

#### Zero-config Jest drop-ins

Add to your Jest config for automatic container lifecycle:

```json
{
  "globalSetup": "@neoma/fixtures/setup/mockserver",
  "globalTeardown": "@neoma/fixtures/teardown/mockserver"
}
```

For multiple services, write a custom setup file using the programmatic API:

```typescript
import { startMockServer, startMailpit } from '@neoma/fixtures/docker'

export default async (): Promise<void> => {
  await startMockServer()
  await startMailpit()
}
```

#### Programmatic API

```typescript
import { startMockServer, stopMockServer } from '@neoma/fixtures/docker'

// Start with defaults (port 1080, prefix "neoma-test")
const config = await startMockServer()
// config.container === "neoma-test-mockserver"
// config.port === 1080
// process.env.MOCKSERVER_URL === "http://localhost:1080/mockserver"

// Start with explicit options
const config = await startMockServer({ prefix: 'myapp-e2e', port: 2080 })

// Stop
await stopMockServer()
await stopMockServer({ prefix: 'myapp-e2e' })
```

#### Port configuration

Ports can be set via options or environment variables. Precedence: option > env var > default.

| Service | Env var (input) | Default | Env var set (output) |
|---------|----------------|---------|---------------------|
| MockServer | `MOCKSERVER_PORT` | `1080` | `MOCKSERVER_URL` |

Use Node's built-in `--env-file` flag to load env vars from a file:

```json
{
  "test": "node --env-file=.env.test node_modules/.bin/jest --runInBand"
}
```

```bash
# .env.test
MOCKSERVER_PORT=1081
NEOMA_TEST_PREFIX=myapp-unit
```

#### Container naming

Containers are named `{prefix}-{service}` where prefix defaults to the `NEOMA_TEST_PREFIX` env var or `"neoma-test"`. Use different prefixes to avoid collisions when running multiple test tiers in parallel.

## License

MIT
