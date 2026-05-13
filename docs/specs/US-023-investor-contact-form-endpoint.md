# Specification: Investor Contact Form Endpoint

**Author:** Amar Smajlovic
**Date:** 2026-05-07
**Status:** Draft
**Ticket:** US-023 · E5

---

## 1. Overview

### 1.1 Summary

A server-side Next.js API Route (`POST /api/contact/investor`) that receives investor enquiry submissions, validates them with Zod, routes the email notification to the correct internal team based on `enquiryType`, and persists the submission to Strapi with an `investor` type tag.

### 1.2 Goals

- Validate all fields server-side before any side effect
- Route email to the correct team based on `enquiryType` (IR / BizDev / Press / General)
- Persist every valid submission to Strapi with `type: 'investor'`
- Return machine-readable error codes so the frontend can show specific messages

### 1.3 Non-Goals

- Sending a confirmation email to the submitter (out of scope)
- Rate limiting / spam protection (separate ticket)
- Admin UI for viewing submissions (separate ticket)
- CRM integration (separate ticket)

### 1.4 User Story

As an investor,
I want to submit an enquiry with my organisation details,
So that I am routed to the correct person at AutoCap.

---

## 2. Acceptance Criteria

### AC-001: Successful submission

GIVEN a POST request to `/api/contact/investor`
AND the body contains valid `fullName`, `organisation`, `role`, `enquiryType`, `email`, `message` (optional), and `gdprConsent: true`
WHEN the handler processes the request
THEN it persists the submission to Strapi with `type: 'investor'`
AND it sends an email to the team address mapped from `enquiryType`
AND it returns HTTP 200 with `{ success: true }`

---

### AC-002: Email routing by enquiryType

GIVEN a valid submission with `enquiryType` set to one of the four values
WHEN the email is sent
THEN `Investment` routes to the IR team (`INVESTOR_IR_EMAIL_TO`)
AND `Partnership` routes to the BizDev team (`INVESTOR_BIZDEV_EMAIL_TO`)
AND `Media` routes to the Press team (`INVESTOR_PRESS_EMAIL_TO`)
AND `Other` routes to the General inbox (`INVESTOR_GENERAL_EMAIL_TO`)
AND the email subject includes `[INVESTOR ENQUIRY]` and the `enquiryType` label

---

### AC-003: enquiryType must be one of the defined enum values

GIVEN a POST request to `/api/contact/investor`
AND `enquiryType` is not one of `Investment`, `Partnership`, `Media`, `Other`
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { enquiryType: 'Invalid enquiry type' } }`
AND no email is sent
AND nothing is persisted

---

### AC-004: GDPR consent rejection

GIVEN a POST request to `/api/contact/investor`
AND `gdprConsent` is `false` or missing
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { gdprConsent: 'You must accept the privacy policy' } }`
AND no email is sent
AND nothing is persisted

---

### AC-005: Validation error — missing or malformed fields

GIVEN a POST request to `/api/contact/investor`
AND one or more required fields are missing, empty, or malformed (e.g. invalid email format)
WHEN the handler processes the request
THEN it returns HTTP 422 with `{ error: 'validation', fields: { [fieldName]: 'error message' } }`
AND the `fields` object contains an entry for each failing field
AND no email is sent
AND nothing is persisted

---

### AC-006: Email send failure

GIVEN a valid request that passes Zod validation
AND the DB write succeeds
WHEN the email service throws an error
THEN the submission remains persisted in Strapi
AND the handler returns HTTP 500 with `{ error: 'send_failed' }`

---

### AC-007: Database write failure

GIVEN a valid request that passes Zod validation
WHEN the Strapi write throws an error
THEN the handler returns HTTP 500 with `{ error: 'db_failed' }`
AND the error is logged server-side
AND no email is sent

---

### AC-008: Wrong HTTP method

GIVEN a request to `/api/contact/investor` using GET, PUT, or DELETE
WHEN the handler receives it
THEN it returns HTTP 405 with `{ error: 'method_not_allowed' }`

---

## 3. Technical Design

### 3.1 Route

```
POST /api/contact/investor
Content-Type: application/json
```

### 3.2 Zod schema

Add `InvestorSchema` to `src/lib/contact/schema.ts`:

```
EnquiryType enum: 'Investment' | 'Partnership' | 'Media' | 'Other'

InvestorSchema:
  fullName      string, min 1
  organisation  string, min 1
  role          string, min 1
  enquiryType   EnquiryType enum
  email         string, email format
  message       string, optional
  gdprConsent   literal true
```

> **Note:** The existing `src/lib/validation/investorForm.ts` uses `name` (not `fullName`) and `organization` (not `organisation`) and lacks `enquiryType`. The new `InvestorSchema` in `schema.ts` is the canonical definition; the legacy validation file should be removed once the frontend is wired to the new endpoint.

### 3.3 Request body

```json
{
  "fullName": "Erik Lindqvist",
  "organisation": "Nordic Capital Partners",
  "role": "Managing Partner",
  "enquiryType": "Investment",
  "email": "erik@nordiccapital.se",
  "message": "We are interested in co-investment opportunities.",
  "gdprConsent": true
}
```

### 3.4 Response shapes

| Status | Body                                                                        |
| ------ | --------------------------------------------------------------------------- |
| 200    | `{ "success": true }`                                                       |
| 405    | `{ "error": "method_not_allowed" }`                                         |
| 422    | `{ "error": "validation", "fields": { "email": "Invalid email address" } }` |
| 500    | `{ "error": "send_failed" }` or `{ "error": "db_failed" }`                  |

### 3.5 Database

Submissions persisted to Strapi `contact-submissions` collection via `POST /api/contact-submissions`.

Investor payload sent to Strapi:

```json
{
  "name": "Erik Lindqvist",
  "email": "erik@nordiccapital.se",
  "message": "We are interested in co-investment opportunities.",
  "gdprConsent": true,
  "type": "investor",
  "metadata": {
    "organisation": "Nordic Capital Partners",
    "role": "Managing Partner",
    "enquiryType": "Investment"
  }
}
```

The Strapi schema already has `type` (enumeration) and `metadata` (json) from the entrepreneur endpoint. No CMS schema change required — only add `investor` to the `type` enum if not already present.

### 3.6 Email routing

Add `sendInvestorEmail()` to `src/lib/contact/emailService.ts`.

Recipient is resolved from `enquiryType` via a lookup map backed by env vars:

| enquiryType | Env var                     | Fallback                  |
| ----------- | --------------------------- | ------------------------- |
| Investment  | `INVESTOR_IR_EMAIL_TO`      | `ir@autocapgroup.se`      |
| Partnership | `INVESTOR_BIZDEV_EMAIL_TO`  | `bizdev@autocapgroup.se`  |
| Media       | `INVESTOR_PRESS_EMAIL_TO`   | `press@autocapgroup.se`   |
| Other       | `INVESTOR_GENERAL_EMAIL_TO` | `kontakt@autocapgroup.se` |

Subject: `[INVESTOR ENQUIRY] {enquiryType} — {fullName} ({organisation})`

Email body must include all fields so the recipient has full context.

### 3.7 Files to create or modify

| File                                      | Action | Description                                |
| ----------------------------------------- | ------ | ------------------------------------------ |
| `src/app/api/contact/investor/route.ts`   | Create | Next.js route entry — delegates to handler |
| `src/app/api/contact/investor/handler.ts` | Create | Core logic: validate → DB → email          |
| `src/lib/contact/schema.ts`               | Modify | Add `EnquiryType` enum + `InvestorSchema`  |
| `src/lib/contact/emailService.ts`         | Modify | Add `sendInvestorEmail()`                  |

### 3.8 Execution order

1. Method guard → 405 if not POST
2. Parse and validate body with Zod → 422 on failure
3. Persist to Strapi with `type: 'investor'`
4. Resolve recipient from `enquiryType` map, send email → 500 `send_failed` on failure (DB row already committed)
5. Return 200

---

## 4. Test Plan

| #   | Level       | File                                     | Test name                                                                 |
| --- | ----------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| 1   | Integration | `app/api/contact/investor/route.test.ts` | returns 200 on valid Investment submission                                |
| 2   | Integration | same                                     | returns 200 on valid Partnership submission                               |
| 3   | Integration | same                                     | returns 200 on valid Media submission                                     |
| 4   | Integration | same                                     | returns 200 on valid Other submission                                     |
| 5   | Integration | same                                     | returns 422 when gdprConsent is false                                     |
| 6   | Integration | same                                     | returns 422 when email is malformed                                       |
| 7   | Integration | same                                     | returns 422 when enquiryType is not a valid enum value                    |
| 8   | Integration | same                                     | returns 422 when fullName is empty                                        |
| 9   | Integration | same                                     | returns 422 when organisation is missing                                  |
| 10  | Integration | same                                     | returns 422 when role is missing                                          |
| 11  | Integration | same                                     | returns 422 with field-level errors for multiple failures                 |
| 12  | Integration | same                                     | returns 500 send_failed when email service throws (DB write still called) |
| 13  | Integration | same                                     | returns 500 db_failed when Strapi write throws (no email sent)            |
| 14  | Integration | same                                     | returns 405 for GET request                                               |
| 15  | Integration | same                                     | email subject includes [INVESTOR ENQUIRY] prefix                          |
| 16  | Integration | same                                     | Investment enquiry email sent to IR address, not general                  |
| 17  | Integration | same                                     | Partnership enquiry email sent to BizDev address                          |
| 18  | Integration | same                                     | Media enquiry email sent to Press address                                 |
| 19  | Integration | same                                     | Other enquiry email sent to General address                               |
| 20  | Integration | same                                     | submission persisted with type = 'investor'                               |
| 21  | Unit        | `lib/contact/schema.test.ts`             | InvestorSchema accepts all four enquiryType values                        |
| 22  | Unit        | same                                     | InvestorSchema rejects enquiryType outside enum                           |
| 23  | Unit        | same                                     | InvestorSchema rejects gdprConsent false                                  |
| 24  | Unit        | same                                     | InvestorSchema accepts valid full payload                                 |
| 25  | Unit        | same                                     | InvestorSchema accepts payload without optional message                   |

---

## 5. Traceability Matrix

| Criterion | Test #                  | Status |
| --------- | ----------------------- | ------ |
| AC-001    | 1–4                     | ⏳     |
| AC-002    | 15–19                   | ⏳     |
| AC-003    | 7, 22                   | ⏳     |
| AC-004    | 5, 23                   | ⏳     |
| AC-005    | 6, 8, 9, 10, 11, 24, 25 | ⏳     |
| AC-006    | 12                      | ⏳     |
| AC-007    | 13                      | ⏳     |
| AC-008    | 14                      | ⏳     |

---

## 6. Open Questions

1. **Legacy `investorForm.ts`** — should it be deleted in this ticket or in a follow-up cleanup? It duplicates the schema with different field names.
2. **Strapi enum** — confirm `investor` is already present in the `contact-submission` `type` enum. If not, a CMS schema update is needed before this endpoint can persist correctly.
3. **`fullName` vs `name`** — Strapi stores the field as `name`. The handler should map `fullName → name` when building the Strapi payload (same as entrepreneur maps `workshopName` → `metadata`).
