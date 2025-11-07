# Security Policy

## Supported Versions

We monitor and maintain the repository on the `main` branch. Security fixes are applied as quickly as possible; please assume the latest commit on `main` is the actively maintained code. If a vulnerability affects only older releases, we will indicate that in the security advisory.

## Reporting a Vulnerability

Please report security issues privately. Do NOT open public issues for sensitive security reports.

Preferred contact methods:

- Email: mandar@example.com (PGP optional)
- GitHub Security Advisories: https://github.com/organizations/Mandar123454/settings/security/policy (or open a private advisory for this repository)

When reporting, please include:

- A clear summary of the vulnerability
- Steps to reproduce (ideally a minimal test case)
- Impact assessment (data exposure, RCE, auth bypass, etc.)
- Any suggested remediation or mitigation
- Your contact information (email) for follow-up

If you use encrypted email, the project maintainer's PGP key fingerprint is:

- PGP Key: (optional) add key block here if you have one

## Response Process

- We will acknowledge receipt of a security report within 3 business days.
- We will triage and provide an initial assessment and mitigation plan within 14 calendar days.
- For confirmed vulnerabilities, we aim to publish a fix and coordinated disclosure within 90 days, depending on the severity and the availability of a patch.
- If a vulnerability requires immediate public notification (e.g., ongoing exploitation), we will follow responsible disclosure best practices and coordinate with the reporter.

## Supported Platforms and Components

This project is a Flask-based web application (Python). Typical components include:

- Python runtime (recommended 3.11)
- Flask and Flask-CORS
- scikit-learn, Pandas, NumPy
- Gunicorn (production WSGI)

When reporting, please include the versions of these components if they are relevant to the issue.

## Disclosure Timeline

We follow responsible disclosure. If you are a researcher or security professional and would like to coordinate disclosure, please email us at the address above. We will work with you to establish a disclosure timeline.

## After Disclosure

- We will credit external reporters in changelogs or advisories unless they request anonymity.
- We will publish remediation steps and provide updates until the issue is resolved.

*Last updated: November 2025*
