# TraceTax case-study prototype

TraceTax is a clickable frontend prototype for the AI Engineer case study. It focuses on **Challenge 01: Source Document Traceability** and **Challenge 10: Trustworthy AI**, with supporting patterns for status, navigation, and interaction affordances.

## The product idea

A CPA can select a value on Maya Chen's sample 2025 return and immediately see the source document, exact source field, extracted value, any calculation, AI confidence, and review state. The reviewer can verify the result, correct it, or flag an issue without leaving the review workflow.

The charitable-contribution example intentionally has lower confidence and a partially obscured source. It demonstrates the non-happy path the design is intended to solve.

## What is functional

- Selecting return fields changes the linked source document and evidence trail.
- AI confidence and explanation change by field.
- The charity field displays a multi-document calculation and review warning.
- Verify, correct, and flag actions update the visible interface.
- Review progress updates after verification.
- The layout adapts for desktop, tablet, and narrow screens.

## What is simulated

All clients, documents, return values, AI outputs, confidence scores, calculations, and audit messages are hardcoded. There is no authentication, OCR, tax engine, AI model, database, or persistent audit log. Refreshing the page resets the demo.

## Run locally

Install packages with `npm install`, then run `npm run dev` and open the local address shown in the terminal.

## Design decisions

- Return fields, source evidence, and AI reasoning remain visible together to reduce context switching.
- Confidence is paired with a plain-language reason; it is never presented as a score alone.
- Low confidence triggers a concrete review action rather than a generic warning.
- Corrections preserve the original AI result conceptually through explicit audit-trail messaging.
- Status uses labels and icons in addition to color.
