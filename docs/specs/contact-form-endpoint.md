# Specification: General Contact Form Endpoint

**Author:** Amar Smajlovic
**Date:** 2026-05-06
**Status:** Draft
**Ticket:** E5

---

## 1. Overview

### 1.1 Summary

A server-side Next.js API Route (`POST /api/contact/general`) that receives contact form submissions, validates them with Zod, sends an email notification to the AutoCap team, and persists the submission to a PostgreSQL database.

### 1.2 Goals

- Validate all incoming fields server-side before any side effects
- Send an email to `kontakt@autocapgroup.se` on every valid submission
- Persist every valid submission to the database for audit purposes
- Return machine-readable error codes so the frontend can show specific messages

### 1.3 Non-Goals

- Sending a confirmation email to the submitter (out of scope)
- Rate limiting / spam protection (separate ticket)
- Admin UI for viewing submissions (separate ticket)

### 1.4 User Story

As a website visitor,
I want to submit a general enquiry through the contact form,
So that I know my message has reached the AutoCap team.

---

## 2. Acceptance Criteria

### AC-001: Successful submission

GIVEN a POST request to `/api/contact/general`
AND the body contains valid `name` (string, non-empty), `email` (valid email), `message` (string, non-empty), `gdprConsent` (boolean `true`)
WHEN the handler processes the request
THEN it sends an email to `kontakt@autocapgroup.se` with name, email, and message
AND it persists the submission to the `contact_submissions` table
AND it returns HTTP 200 with `{ success: true }`

---

### AC-002: GDPR consent rejection

GIVEN a POST request to `/api/contact/general`
AND `gdprConsent` is `false` or missing
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { gdprConsent: 'Consent is required' } }`
AND no email is sent
AND nothing is persisted

---

### AC-003: Validation error — missing or malformed fields

GIVEN a POST request to `/api/contact/general`
AND one or more required fields are missing, empty, or malformed (e.g. invalid email format)
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { [fieldName]: 'error message' } }`
AND the `fields` object contains an entry for each failing field
AND no email is sent
AND nothing is persisted

---

### AC-004: Email send failure

GIVEN a valid request that passes Zod validation
WHEN the email service throws an error
THEN the submission is still persisted to the database
AND the handler returns HTTP 500 with `{ error: 'send_failed' }`

---

### AC-005: Database write failure

GIVEN a valid request that passes Zod validation
AND the email sends successfully
WHEN the database write throws an error
THEN the handler returns HTTP 500 with `{ error: 'db_failed' }`
AND the error is logged server-side

---

### AC-006: Wrong HTTP method

GIVEN a request to `/api/contact/general` using GET, PUT, or DELETE
WHEN the handler receives it
THEN it returns HTTP 405 with `{ error: 'method_not_allowed' }`

---

## 3. Technical Design

### 3.1 Route

```
POST /api/contact/general
Content-Type: application/json
```

### 3.2 Zod schema

```ts
const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  gdprConsent: z.literal(true),
});
```

### 3.3 Request body

```json
{
  "name": "Anna Lindqvist",
  "email": "anna@example.com",
  "message": "I'd like to know more about your acquisition process.",
  "gdprConsent": true
}
```

### 3.4 Response shapes

| Status | Body                                                                |
| ------ | ------------------------------------------------------------------- |
| 200    | `{ "success": true }`                                               |
| 405    | `{ "error": "method_not_allowed" }`                                 |
| 422    | `{ "error": "validation", "fields": { "email": "Invalid email" } }` |
| 500    | `{ "error": "send_failed" }` or `{ "error": "db_failed" }`          |

### 3.5 Database table

```sql
CREATE TABLE contact_submissions (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.6 Email service

Use SendGrid (`@sendgrid/mail`) or AWS SES via env var `EMAIL_PROVIDER=sendgrid|ses`.
Required env vars: `SENDGRID_API_KEY`, `CONTACT_EMAIL_TO` (defaults to `kontakt@autocapgroup.se`).

### 3.7 Execution order

1. Method guard → 405 if not POST
2. Parse + validate body with Zod → 422 on failure
3. Persist to DB
4. Send email → 500 `send_failed` on failure (DB row already committed)
5. Return 200

---

## 4. Test Plan

| #   | Level       | File                                    | Test name                                         | Notes                 |
| --- | ----------- | --------------------------------------- | ------------------------------------------------- | --------------------- |
| 1   | Integration | `app/api/contact/general/route.test.ts` | returns 200 on valid submission                   | mock email + DB       |
| 2   | Integration | same                                    | returns 422 when gdprConsent is false             |                       |
| 3   | Integration | same                                    | returns 422 when email is malformed               |                       |
| 4   | Integration | same                                    | returns 422 when name is empty                    |                       |
| 5   | Integration | same                                    | returns 422 when message is empty                 |                       |
| 6   | Integration | same                                    | returns 422 with field-level errors               |                       |
| 7   | Integration | same                                    | returns 500 send_failed when email service throws | DB write still called |
| 8   | Integration | same                                    | returns 500 db_failed when DB write throws        |                       |
| 9   | Integration | same                                    | returns 405 for GET request                       |                       |
| 10  | Unit        | `lib/contact/schema.test.ts`            | Zod schema rejects gdprConsent false              |                       |
| 11  | Unit        | same                                    | Zod schema rejects invalid email                  |                       |
| 12  | Unit        | same                                    | Zod schema accepts valid payload                  |                       |

---

## 5. Traceability Matrix

| Criterion | Test #             | Status |
| --------- | ------------------ | ------ |
| AC-001    | 1                  | —      |
| AC-002    | 2, 10              | —      |
| AC-003    | 3, 4, 5, 6, 11, 12 | —      |
| AC-004    | 7                  | —      |
| AC-005    | 8                  | —      |
| AC-006    | 9                  | —      |

---

## 6. Open Questions

1. **Email provider** — SendGrid or AWS SES? Need env var decision before implementation.
2. **Subject field** — ticket doesn't list it; include as optional Zod field or drop it?
3. **PostgreSQL client** — use existing DB client or set one up (Prisma / pg / Drizzle)?
