exports.registerEmailTemplate = (name, email, token) => ({
  Source: process.env.EMAIL_FROM,
  Destination: {
    ToAddresses: [email],
  },
  ReplyToAddresses: [process.env.EMAIL_TO],
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: `
        <!DOCTYPE html>
          <html lang='en'>
            <head>

              <meta charset="utf-8">
              <meta http-equiv="x-ua-compatible" content="ie=edge">
              <title>Email Confirmation</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style type="text/css">

              @media screen {
                @font-face {
                  font-family: "Inter", sans-serif;
                  font-style: normal;
                  font-weight: 400;
                  src: local('Source Inter Regular'), local('SourceInter-Regular'), @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap') format('woff');
                }
                @font-face {
                  font-family: "Inter", sans-serif;
                  font-style: normal;
                  font-weight: 700;
                  src: local('Source Inter Bold'), local('SourceInter-Bold'), url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap') format('woff');
                }
              }
            
              body,
              table,
              td,
              a {
                -ms-text-size-adjust: 100%; /* 1 */
                -webkit-text-size-adjust: 100%; /* 2 */
              }

              table,
              td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
              }

              img {
                -ms-interpolation-mode: bicubic;
              }

              a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
              }
            
              div[style*="margin: 16px 0;"] {
                margin: 0 !important;
              }
              body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }

              table {
                border-collapse: collapse !important;
              }
              a {
                color: #1a82e2;
              }
              img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
              }
              </style>

            </head>
            <body style="background-color: #e9ecef;">

              <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
                A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
              </div>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="center" valign="top" style="padding: 36px 24px;">
                          <a href="${process.env.CLIENT_URL}" target="_blank" style="display: inline-block; text-decoration: none; font-family: Inter, sans-serif;">
                            <h1>Traffikr.IO</h1>
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: Inter, Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                          <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>

                          <h4>Hello ${name},</h4>
                          <h5>Thanks for registering with Traffikr.IO</h5>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#e9ecef">
              
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: Inter, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="${process.env.CLIENT_URL}">Traffikr.IO</a>, you can safely delete this email.</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" bgcolor="#ffffff">
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                      <a href="${process.env.CLIENT_URL}/activate/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: Inter, Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Activate Account</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: Inter, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                          <p style="margin: 0;"><a href="${process.env.CLIENT_URL}/activate/${token}" target="_blank">${process.env.CLIENT_URL}/activate/${token}</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: Inter, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                          <p style="margin: 0;">Cheers,<br> Traffikr.IO</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: Inter, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                          <p style="margin: 0;">You received this email because we received a request for signing up for an account with Traffikr.IO. If you didn't request for a sign up, you can safely delete this email.</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: Inter, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                          <p style="margin: 0;">To stop receiving these emails, you can <a href="#" target="_blank">unsubscribe</a> at any time.</p>
                          <p style="margin: 0;">Traffikr.IO. Lagos, Nigeria</p>
                        </td>
                      </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`,
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "Complete Your Registration",
    },
  },
});

//  <html>
//    <body>
//      <h1>Verify Your Email</h1>
//      <h3>Hello ${name}</h3>
//      <div>
//        <p>You recently signed up in traffikr.io</p>
//        <p style="margin-bottom: 20px">
//          Please click the button below to activate your account and complete
//          your registration.
//        </p>
//        <a
//          href="${process.env.CLIENT_URL}/activate/${token}"
//          style="padding: 15px 20px; background-color: green; color: #fff;border: none; border-radius: 4px; text-decoration: none"
//        >
//          Activate
//        </a>
//        <p>Not able to click the button above? Use the link below</p>
//        <p>
//          ${process.env.CLIENT_URL}/activate/${token}
//        </p>
//      </div>
//    </body>
//  </html>;
