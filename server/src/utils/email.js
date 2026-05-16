import { MailtrapClient } from "mailtrap";

const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "Project Desk",
};

/**
 * Generic Mailtrap transactional email sender
 */
async function sendMailtrapEmail(to, subject, html) {
  if (!process.env.MAILTRAP_API_TOKEN) {
    console.log("ℹ️ MAILTRAP_API_TOKEN not configured - skipping email for:", to);
    return;
  }

  try {
    const response = await client.send({
      from: sender,
      to: [{ email: to }],
      subject,
      html,
      category: "ProjectDesk",
    });

    console.log("✅ Email sent successfully to:", to, "| Message ID:", response.message_ids?.[0] || response.id);

    return response;
  } catch (error) {
    console.error("❌ Failed to send email to:", to);
    console.error("Error:", error.message);
    if (error.response?.data) {
      console.error("Mailtrap Response:", error.response.data);
    }
    throw error;
  }
}

/**
 * Send account verification email
 */
export async function sendVerificationEmail(user, token) {
  const appUrl = process.env.APP_URL || "http://localhost:5173";
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #5b3df5 0%, #7c5cef 100%); padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Project Desk</h1>
      </div>

      <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${user.name}</strong>,</p>

        <p style="margin: 0 0 30px 0; font-size: 15px; color: #6b7280;">
          Thank you for signing up! Please verify your email address to activate your account and start managing your projects.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background: #5b3df5; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </div>

        <p style="margin: 30px 0 0 0; font-size: 14px; color: #9ca3af;">
          Or copy and paste this link into your browser:
        </p>

        <p style="margin: 10px 0 0 0; font-size: 13px; color: #5b3df5; word-break: break-all;">
          ${verifyUrl}
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          This verification link expires in 1 hour. If you didn’t create this account, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  try {
    await sendMailtrapEmail(
      user.email,
      "Verify Your Project Desk Account",
      html
    );
  } catch (error) {
    console.error("❌ Failed to send verification email:", error.message);
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(user, token) {
  const appUrl = process.env.APP_URL || "http://localhost:5173";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #5b3df5 0%, #7c5cef 100%); padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
      </div>

      <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hi <strong>${user.name}</strong>,</p>

        <p style="margin: 0 0 30px 0; font-size: 15px; color: #6b7280;">
          We received a request to reset your password. Click below to securely create a new password.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #5b3df5; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>

        <p style="margin: 30px 0 0 0; font-size: 14px; color: #9ca3af;">
          Or copy and paste this link into your browser:
        </p>

        <p style="margin: 10px 0 0 0; font-size: 13px; color: #5b3df5; word-break: break-all;">
          ${resetUrl}
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          This reset link expires in 1 hour. If you didn’t request a password reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

  try {
    await sendMailtrapEmail(
      user.email,
      "Reset Your Project Desk Password",
      html
    );
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error.message);
  }
}

export async function sendSupportEmail(user, subject, message) {
  const supportAddress = process.env.SUPPORT_EMAIL || "support@projectdesk.app";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #5b3df5 0%, #7c5cef 100%); padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Project Desk Support Request</h1>
      </div>

      <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 12px 0; font-size: 16px; color: #111827;"><strong>${user.name}</strong> &lt;${user.email}&gt; submitted a support request.</p>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280;"><strong>Subject:</strong> ${subject}</p>
        <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 15px; color: #111827; white-space: pre-wrap;">${message}</p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
          This message was generated by Project Desk.
        </p>
      </div>
    </div>
  `;

  try {
    await sendMailtrapEmail(
      supportAddress,
      `Support request from ${user.name} <${user.email}>: ${subject}`,
      html
    );
  } catch (error) {
    console.error("❌ Failed to send support email:", error.message);
  }
} 