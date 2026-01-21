# Backend Task: Add `link` Content Block to Blog API

## Summary
Frontend now supports a new `link` content block inside blog post content. Backend needs to persist, validate, and serve this new block type.

## New Content Block Type
- **type**: `link`
- **fields**:
  - `linkTitle` (string, required) — display text/title for the link.
  - `linkUrl` (string, required) — full URL (e.g., `https://example.com`).
  - `linkImage` (string, optional) — preview image URL for the link.

## Schema Changes (Blog Post Content Array)
- Allow `type: "link"` in `content[]`.
- For `type === "link"`:
  - Validate `linkTitle` is non-empty string.
  - Validate `linkUrl` is a full URL (http/https). Reject relative paths.
  - `linkImage` optional but, if present, should also be a full URL.
- Existing block types remain unchanged.

## API Contract Updates
Applies to:
- `POST /api/blog/posts`
- `PUT /api/blog/posts/:id`
- `GET /api/blog/posts`
- `GET /api/blog/posts/:id`
- `GET /api/blog/posts/slug/:slug`

Behavior:
- Requests may include `content` blocks with `type: "link"` and the fields above.
- Responses should return `link` blocks unchanged.

Example content block:
```json
{
  "id": "123",
  "type": "link",
  "linkTitle": "View Project",
  "linkUrl": "https://example.com/project",
  "linkImage": "https://example.com/preview.jpg"
}
```

## Validation Rules
- `linkTitle`: required, non-empty string.
- `linkUrl`: required, must start with `http://` or `https://`.
- `linkImage`: optional; if provided, must start with `http://` or `https://`.
- Reject blocks missing required fields with `400 Bad Request`.

## Default Values
- If `linkImage` is absent, omit it or set `null`; do not fail the request.

## Migration / Seed Data
- Existing posts: no changes needed unless you want to backfill sample link blocks.

## Tests (recommended)
- Create post with a link block (happy path).
- Update post adding a link block.
- Reject invalid `linkUrl` (non-URL or relative).
- Allow link block without `linkImage`.
- Ensure GET returns link blocks intact.

## Frontend Context
- Types updated in `src/services/blogApi.ts`:
  - `ContentBlockType` includes `link`.
  - `ContentBlock` includes `linkTitle`, `linkUrl`, `linkImage`.
- UI already renders/collects these fields; backend just needs to store/return them.
