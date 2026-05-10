export const bankEmailTemplate = (otp: number) => {

  const digitBoxes = otp.toString().split('')
    .map(d => `
      <td style="padding: 0 4px;">
        <div style="
          width: 48px;
          height: 58px;
          background: #1a1a2e;
          border: 2px solid #d32f2f;
          border-radius: 10px;
          text-align: center;
          line-height: 58px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          display: inline-block;
        ">${d}</div>
      </td>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BankSecure — Verify Your Identity</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" border="0" style="max-width:540px; width:100%;">

          <!-- Brand -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <div style="
                      width: 36px; height: 36px;
                      border-radius: 8px;
                      background: #d32f2f;
                      text-align: center;
                      line-height: 36px;
                      display: inline-block;
                    ">
                      <span style="color:#fff; font-size:18px; font-weight:bold;">B</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size:20px; font-weight:700; color:#1a1a2e; letter-spacing:-0.5px;">BankSecure</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">

              <!-- top accent bar -->
              <div style="height:4px; background:#d32f2f;"></div>

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:24px 28px 20px; border-bottom:1px solid #e2e8f0;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top; padding-right:12px;">
                          <div style="
                            width:40px; height:40px;
                            background:#fff3f3;
                            border:1px solid #fecaca;
                            border-radius:10px;
                            text-align:center;
                            line-height:40px;
                            display:inline-block;
                            font-size:20px;
                          ">🔐</div>
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 5px 0; font-size:16px; font-weight:700; color:#1a1a2e;">
                            Verify your identity
                          </p>
                          <p style="margin:0; font-size:12px; color:#64748b; line-height:1.6;">
                            Use the one-time password below to complete your request.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- OTP Section -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:28px 28px 24px;">

                    <p style="margin:0 0 16px 0; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#94a3b8;">
                      Your one-time password
                    </p>

                    <!-- digit boxes -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px auto;">
                      <tr>
                        ${digitBoxes}
                      </tr>
                    </table>

                    <!-- expiry -->
                    <div style="display:inline-block; background:#fffbeb; border:1px solid #fcd34d; border-radius:20px; padding:6px 16px;">
                      <span style="font-size:12px; color:#78716c;">
                        Expires in <strong style="color:#b45309;">10 minutes</strong>
                      </span>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px; background:#e2e8f0; margin:0 28px;"></div>

              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:20px 28px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top; padding-right:12px;">
                          <div style="
                            width:36px; height:36px;
                            background:#f0fdf4;
                            border:1px solid #bbf7d0;
                            border-radius:8px;
                            text-align:center;
                            line-height:36px;
                            display:inline-block;
                            font-size:18px;
                          ">🔒</div>
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 4px 0; font-size:12px; font-weight:700; color:#374151;">
                            Keep this code private
                          </p>
                          <p style="margin:0; font-size:11px; color:#94a3b8; line-height:1.6;">
                            BankSecure will never ask for your OTP via phone or email.
                            If you did not request this, please contact support immediately.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 28px; border-radius:0 0 16px 16px;">
                    <p style="margin:0 0 8px 0; font-size:11px; color:#94a3b8; line-height:1.7;">
                      This email was sent because your account requested a verification code.
                      Need help? Contact us at
                      <a href="mailto:support@banksecure.com" style="color:#64748b; text-decoration:none;">support@banksecure.com</a>
                    </p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:16px;">
                          <a href="#" style="font-size:11px; color:#94a3b8; text-decoration:none;">Privacy Policy</a>
                        </td>
                        <td style="padding-right:16px;">
                          <a href="#" style="font-size:11px; color:#94a3b8; text-decoration:none;">Terms of Service</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Bottom tag -->
          <tr>
            <td align="center" style="padding-top:20px;">
              <p style="font-size:11px; color:#cbd5e1; margin:0;">
                © ${new Date().getFullYear()} BankSecure. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
};