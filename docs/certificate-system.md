# Certificate Generation System

## Overview

The certificate system lives at `/certifications` and provides a certificate studio with live preview, editable fields, template switching, draggable element positioning, logo/signature upload, QR-style verification block, bulk CSV import, email handoff, and export to PDF, PNG, JPG, and print-ready SVG.

## API

`GET /api/certificates`

Returns analytics, available templates, and the certificate schema.

`POST /api/certificates`

Creates a demo issued certificate response.

```json
{
  "recipientName": "Moeed Kamraan",
  "courseName": "Full Stack Web Development",
  "completionDate": "2026-05-25",
  "templateId": "luxury"
}
```

## Database Schema

Recommended production tables or collections:

- `CertificateTemplate`: id, name, styleJson, backgroundUrl, logoUrl, isActive, createdBy, createdAt
- `Certificate`: id, recipientName, recipientEmail, courseName, completionDate, instructorName, organizationName, duration, grade, templateId, verificationUrl, status, createdAt
- `CertificateDownload`: id, certificateId, userId, format, ipAddress, downloadedAt
- `CertificateVerification`: id, certificateId, ipAddress, userAgent, scannedAt, result
- `CertificateBulkJob`: id, uploadedBy, sourceFileUrl, totalRows, successRows, failedRows, status, createdAt

## Deployment Notes

- Store generated certificate records in PostgreSQL or MongoDB.
- Store logos, signatures, and exported files in object storage such as S3, R2, or Supabase Storage.
- Replace the demo `/verify/[id]` pattern check with a database lookup.
- Put email delivery behind a provider such as Resend, SendGrid, or AWS SES.
- Protect admin routes with role-based auth. The demo auth route returns `admin` for the configured admin credential.
