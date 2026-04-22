# Part 2: Kong API Gateway Rate and Size Limiting

To perform rate limiting and request size limiting with Kong API Gateway, you can use the `rate-limiting` and `request-size-limiting` plugins.

## 1. Rate Limiting
The `rate-limiting` plugin allows you to restrict the number of requests a client can make in a given timeframe.

### Configuration (Declarative)
In your `kong.yaml` (or via Admin API), add the following:
```yaml
plugins:
  - name: rate-limiting
    config:
      minute: 5
      policy: local
```
*   **Result**: Clients are limited to 5 requests per minute.

## 2. Request Size Limiting
The `request-size-limiting` plugin blocks requests with payloads larger than a specified limit.

### Configuration (Declarative)
```yaml
plugins:
  - name: request-size-limiting
    config:
      allowed_payload_size: 1 # Size in Megabytes
```
*   **Result**: Any request body larger than 1MB will be rejected with a `413 Request Entity Too Large` status code.

## 3. Applying the Configuration
If using **decK** (Declarative Configuration for Kong):
```bash
deck sync -s kong-config.yaml
```

If using the **Admin API** (via curl):
### Enable Rate Limiting:
```bash
curl -i -X POST http://localhost:8001/services/record-label-service/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=5" \
  --data "config.policy=local"
```

### Enable Request Size Limiting:
```bash
curl -i -X POST http://localhost:8001/services/record-label-service/plugins \
  --data "name=request-size-limiting" \
  --data "config.allowed_payload_size=1"
```
