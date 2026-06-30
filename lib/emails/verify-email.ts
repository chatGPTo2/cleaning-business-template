export function buildVerifyEmailHtml(
  firstName: string,
  verifyUrl: string,
  type: "contact" | "quote",
): string {
  const subject = type === "quote"
    ? "confirm your booking request"
    : "verify your contact message";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;
              overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">

    <div style="background:#0f172a;padding:28px 32px">
      <p style="margin:0;color:#2dd4bf;font-size:12px;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em">Email Verification</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700">
        One more step, ${firstName}
      </h1>
      <p style="margin:4px 0 0;color:#94a3b8;font-size:14px">Please verify your email address to ${subject}.</p>
    </div>

    <div style="padding:36px 32px;text-align:center">
      <p style="margin:0 0 28px;color:#374151;font-size:15px;line-height:1.6;text-align:left">
        Click the button below to verify your email and submit your ${type === "quote" ? "booking request" : "message"}.
        This link is valid for <strong>24 hours</strong>.
      </p>

      <a href="${verifyUrl}"
         style="display:inline-block;background:#0d9488;color:#ffffff;font-size:16px;font-weight:700;
                text-decoration:none;padding:16px 36px;border-radius:12px;letter-spacing:.01em">
        Verify My Email &rarr;
      </a>

      <p style="margin:28px 0 0;color:#9ca3af;font-size:12px;line-height:1.6">
        Button not working?<br>
        <a href="${verifyUrl}" style="color:#0d9488;font-weight:600;text-decoration:underline">
          Open verification link
        </a>
      </p>

      <p style="margin:20px 0 0;color:#9ca3af;font-size:12px">
        If you didn&apos;t submit a request to Taspro Cleaning, you can safely ignore this email.
      </p>
    </div>

    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
      <p style="margin:0;color:#94a3b8;font-size:12px">
        Taspro Cleaning Solutions &mdash; tasprocleaning.com.au
      </p>
    </div>
  </div>
</body>
</html>`;
}
