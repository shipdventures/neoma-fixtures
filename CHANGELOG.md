# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `startMailpit(options?)` — starts a Mailpit Docker container with SMTP and API ports
- `stopMailpit(options?)` — stops the Mailpit Docker container
- `startMinIO(options?)` — starts a MinIO Docker container, creates a bucket, and sets storage env vars
- `stopMinIO(options?)` — stops the MinIO Docker container
- `startMockServer(options?)` — starts a MockServer Docker container with health-check polling and sets `MOCKSERVER_URL` env var
- `stopMockServer(options?)` — stops the MockServer Docker container using the standard naming convention
- `waitForHttp(url, options?)` — shared health-check utility that polls an HTTP endpoint until 2xx
- `waitForTcp(host, port, options?)` — shared health-check utility that probes a TCP port
- `@neoma/fixtures/setup/mailpit` — Jest `globalSetup` drop-in for Mailpit
- `@neoma/fixtures/setup/minio` — Jest `globalSetup` drop-in for MinIO
- `@neoma/fixtures/setup/mockserver` — Jest `globalSetup` drop-in for MockServer
- `@neoma/fixtures/teardown/mailpit` — Jest `globalTeardown` drop-in for Mailpit
- `@neoma/fixtures/teardown/minio` — Jest `globalTeardown` drop-in for MinIO
- `@neoma/fixtures/teardown/mockserver` — Jest `globalTeardown` drop-in for MockServer
- `@neoma/fixtures/docker` — new sub-path export for Docker container utilities

## [0.1.0] - 2026-04-13

### Added

- `express.request()` — mock Express Request with randomized defaults and case-insensitive header access
- `express.response()` — mock Express Response with `status()`, `json()`, `send()`, `header()`, `getHeader()`, `setHeader()`, `removeHeader()`, `cookie()`, `clearCookie()`, `redirect()`, `render()`, `end()` as Jest mocks
- `express.cookie()` — HMAC-SHA256 signed cookie string matching cookie-parser format
- `executionContext()` — partial NestJS ExecutionContext supporting both bare handler functions and typed route objects
- `MockLoggerService` — implements `LoggerService` with all methods as `jest.fn()`
- `toThrowMatching` / `toMatchError` — custom Jest matchers for error class and property assertions

[Unreleased]: https://github.com/shipdventures/neoma-fixtures/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/shipdventures/neoma-fixtures/releases/tag/v0.1.0
