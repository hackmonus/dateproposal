# Our Little Plan

A cute, Mumbai-first date planner. The recipient chooses a food chain, date setting, Mumbai zone, date, time, favourite colour, recipient email, and bill split. The final letter is saved to `data/responses.json` and can be sent to both inboxes through SMTP.

## Mail setup

Copy these variables into `.env.local`:

```env
OWNER_EMAIL=you@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=mailer@example.com
SMTP_PASS=your-password
SMTP_FROM=Our Little Plan <mailer@example.com>
SMTP_SECURE=false
```

The app still saves the response when SMTP is not configured, but it only sends email once all SMTP variables and `OWNER_EMAIL` are present. Never commit `.env.local`.
