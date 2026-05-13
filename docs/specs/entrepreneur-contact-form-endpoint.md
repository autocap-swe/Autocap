# Specification: Entrepreneur Contact Form Endpoint

**Author:** Amar Smajlovic
**Date:** 2026-05-07
**Status:** Draft
**Ticket:** E5

---

## 1. Overview

### 1.1 Summary

A server-side Next.js API Route (`POST /api/contact/entrepreneur`) that receives acquisition enquiry submissions from workshop owners, validates them with Zod, sends a priority email notification to the AutoCap M&A lead, and persists the submission to the database with an `entrepreneur` type tag for lead scoring.

### 1.2 Goals

- Validate all incoming fields server-side before any side effects
- Send a higher-priority email to `nicklas.knape@autocapgroup.se` on every valid submission
- Persist every valid submission to the database with `type: 'entrepreneur'` for lead scoring and CRM use
- Return machine-readable error codes so the frontend can show specific messages

### 1.3 Non-Goals

- Sending a confirmation email to the submitter (out of scope)
- Rate limiting / spam protection (separate ticket)
- Admin UI for viewing submissions (separate ticket)
- CRM integration (separate ticket)

### 1.4 User Story

As a workshop owner,
I want to submit an acquisition enquiry through the entrepreneur contact form,
So that the AutoCap M&A team can follow up with me.

---

## 2. Acceptance Criteria

### AC-001: Successful submission

GIVEN a POST request to `/api/contact/entrepreneur`
AND the body contains valid `name`, `workshopName`, `city`, `annualRevenue`, `email`, `phone`, `message`, and `gdprConsent: true`
WHEN the handler processes the request
THEN it sends an email to `nicklas.knape@autocapgroup.se` with all submission fields
AND it persists the submission to the database with `type: 'entrepreneur'`
AND it returns HTTP 200 with `{ success: true }`

---

### AC-002: Email marked as higher priority than general enquiry

GIVEN a valid submission that triggers an email
WHEN the email is sent
THEN the email subject includes a priority indicator (e.g. `[ACQUISITION ENQUIRY]`)
AND it is sent to `nicklas.knape@autocapgroup.se`, not the general contact address

---

### AC-003: annualRevenue must be one of the defined enum values

GIVEN a POST request to `/api/contact/entrepreneur`
AND `annualRevenue` is not one of `'<5 MSEK'`, `'5-15 MSEK'`, `'15-50 MSEK'`, `'>50 MSEK'`
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { annualRevenue: 'Invalid revenue range' } }`
AND no email is sent
AND nothing is persisted

---

### AC-004: GDPR consent rejection

GIVEN a POST request to `/api/contact/entrepreneur`
AND `gdprConsent` is `false` or missing
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { gdprConsent: 'Consent is required' } }`
AND no email is sent
AND nothing is persisted

---

### AC-005: Validation error — missing or malformed fields

GIVEN a POST request to `/api/contact/entrepreneur`
AND one or more required fields are missing, empty, or malformed (e.g. invalid email format)
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { [fieldName]: 'error message' } }`
AND the `fields` object contains an entry for each failing field
AND no email is sent
AND nothing is persisted

---

### AC-006: Email send failure

GIVEN a valid request that passes Zod validation
WHEN the email service throws an error
THEN the submission is still persisted to the database
AND the handler returns HTTP 500 with `{ error: 'send_failed' }`

---

### AC-007: Database write failure

GIVEN a valid request that passes Zod validation
AND the email sends successfully
WHEN the database write throws an error
THEN the handler returns HTTP 500 with `{ error: 'db_failed' }`
AND the error is logged server-side

---

### AC-008: Wrong HTTP method

GIVEN a request to `/api/contact/entrepreneur` using GET, PUT, or DELETE
WHEN the handler receives it
THEN it returns HTTP 405 with `{ error: 'method_not_allowed' }`

---

## 3. Technical Design

### 3.1 Route

```
POST /api/contact/entrepreneur
Content-Type: application/json
```

### 3.2 Zod schema

```ts
const AnnualRevenue = z.enum(['<5 MSEK', '5-15 MSEK', '15-50 MSEK', '>50 MSEK']);

const EntrepreneurSchema = z.object({
  name: z.string().min(1),
  workshopName: z.string().min(1),
  city: z.string().min(1),
  annualRevenue: AnnualRevenue,
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().min(1),
  gdprConsent: z.literal(true),
});
```

### 3.3 Request body

```json
{
  "name": "Lars Andersson",
  "workshopName": "Däck & Fälg Specialized",
  "city": "Malmö",
  "annualRevenue": "5-15 MSEK",
  "email": "lars@dackfälg.se",
  "phone": "+46 70 123 45 67",
  "message": "Interested in learning more about your acquisition model.",
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

### 3.5 Database

Submissions are persisted to the **Strapi `contact-submissions` collection** via `POST /api/contact-submissions` (same pattern as the general form).

The existing schema needs two new fields added in `cms/src/api/contact-submission/content-types/contact-submission/schema.json`:

- `type` — enumeration: `general` | `entrepreneur` | `investor`, default `general`
- `metadata` — JSON field for form-specific extra fields

Entrepreneur payload sent to Strapi:

```json
{
  "name": "Lars Andersson",
  "email": "lars@dackfälg.se",
  "message": "Interested in learning more.",
  "gdprConsent": true,
  "type": "entrepreneur",
  "metadata": {
    "workshopName": "Däck & Fälg Specialized",
    "city": "Malmö",
    "annualRevenue": "5-15 MSEK",
    "phone": "+46 70 123 45 67"
  }
}
```

> **CMS task:** Add `type` (enumeration) and `metadata` (json) fields to the `contact-submission` schema before implementing this route.

### 3.6 Email

Uses **Resend** via `src/lib/contact/emailService.ts` (same as general form).
A new `sendEntrepreneurEmail()` function is added to that file.

Recipient: `nicklas.knape@autocapgroup.se`
Subject: `[ACQUISITION ENQUIRY] Lars Andersson — Däck & Fälg Specialized (Malmö)`

Email body must include all fields so the M&A lead has full context without opening the admin.

### 3.7 Execution order

1. Method guard → 405 if not POST
2. Parse + validate body with Zod → 422 on failure
3. Persist to DB with `type: 'entrepreneur'`
4. Send email → 500 `send_failed` on failure (DB row already committed)
5. Return 200

---

## 4. Test Plan

| #   | Level       | File                                         | Test name                                              | Notes                       |
| --- | ----------- | -------------------------------------------- | ------------------------------------------------------ | --------------------------- |
| 1   | Integration | `app/api/contact/entrepreneur/route.test.ts` | returns 200 on valid submission                        | mock email + DB             |
| 2   | Integration | same                                         | returns 422 when gdprConsent is false                  |                             |
| 3   | Integration | same                                         | returns 422 when email is malformed                    |                             |
| 4   | Integration | same                                         | returns 422 when annualRevenue is not an enum value    |                             |
| 5   | Integration | same                                         | returns 422 when workshopName is empty                 |                             |
| 6   | Integration | same                                         | returns 422 when city is missing                       |                             |
| 7   | Integration | same                                         | returns 422 with field-level errors for multiple fails |                             |
| 8   | Integration | same                                         | returns 500 send_failed when email service throws      | DB write still called       |
| 9   | Integration | same                                         | returns 500 db_failed when DB write throws             |                             |
| 10  | Integration | same                                         | returns 405 for GET request                            |                             |
| 11  | Integration | same                                         | email subject includes [ACQUISITION ENQUIRY] prefix    | assert on email mock        |
| 12  | Integration | same                                         | email sent to nicklas.knape@autocapgroup.se            | not general contact address |
| 13  | Integration | same                                         | submission persisted with type = 'entrepreneur'        | assert on DB mock           |
| 14  | Unit        | `lib/contact/entrepreneur-schema.test.ts`    | accepts all four annualRevenue enum values             |                             |
| 15  | Unit        | same                                         | rejects annualRevenue outside enum                     |                             |
| 16  | Unit        | same                                         | rejects gdprConsent false                              |                             |
| 17  | Unit        | same                                         | accepts valid full payload                             |                             |

---

## 5. Traceability Matrix

| Criterion | Test #         | Status |
| --------- | -------------- | ------ |
| AC-001    | 1              | —      |
| AC-002    | 11, 12         | —      |
| AC-003    | 4, 14, 15      | —      |
| AC-004    | 2, 16          | —      |
| AC-005    | 3, 5, 6, 7, 17 | —      |
| AC-006    | 8              | —      |
| AC-007    | 9              | —      |
| AC-008    | 10             | —      |

---

## 6. Open Questions

1. **Phone validation** — accepting any non-empty string for now; can tighten later if needed.
