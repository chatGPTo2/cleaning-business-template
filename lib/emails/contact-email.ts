import { BUSINESS } from "@/config/business";

export function buildContactAdminHtml(p: {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  state: string;
  message: string;
}): string {
  const { name, email, phone, suburb, state, message } = p;
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;
              overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">

    <div style="background:#0f172a;padding:28px 32px">
      <p style="margin:0;color:#2dd4bf;font-size:12px;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em">New Contact Enquiry (Verified)</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700">${name}</h1>
      <p style="margin:4px 0 0;color:#94a3b8;font-size:14px">${email}</p>
    </div>

    <div style="padding:28px 32px">
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden">
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:14px;white-space:nowrap">Name</td>
          <td style="padding:8px 12px;color:#111827;font-size:14px;font-weight:600">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:14px;white-space:nowrap">Email</td>
          <td style="padding:8px 12px;color:#111827;font-size:14px;font-weight:600">
            <a href="mailto:${email}" style="color:#0d9488">${email}</a>
          </td>
        </tr>
        ${phone ? `
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:14px;white-space:nowrap">Phone</td>
          <td style="padding:8px 12px;color:#111827;font-size:14px;font-weight:600">
            <a href="tel:${phone}" style="color:#0d9488">${phone}</a>
          </td>
        </tr>` : ""}
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-size:14px;white-space:nowrap">Location</td>
          <td style="padding:8px 12px;color:#111827;font-size:14px;font-weight:600">${suburb}, ${state}</td>
        </tr>
      </table>

      <h3 style="margin:24px 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;
                 letter-spacing:.08em;color:#0d9488">Message</h3>
      <div style="background:#f9fafb;border-radius:8px;padding:16px;color:#111827;
                  font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</div>

      <div style="margin-top:28px;padding:16px;background:#f0fdf4;border-radius:8px;
                  border-left:4px solid #22c55e">
        <p style="margin:0;color:#166534;font-size:13px">
          Reply directly to this email to respond to <strong>${name}</strong>.
        </p>
      </div>
    </div>

    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
      <p style="margin:0;color:#94a3b8;font-size:12px">
        Sent by the ${BUSINESS.name} contact form &mdash; ${BUSINESS.domain}
      </p>
    </div>
  </div>
</body>
</html>`;
}
