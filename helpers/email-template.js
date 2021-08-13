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
        Data: `<html>
                    <body>
                      <h1>Verify Your Email</h1>
                      <h3>Hello ${name}</h3>
                      <div>
                        <p>You recently signed up in traffikr.io</p>
                        <p style="margin-bottom: 20px">Please click the button below to activate your account and complete your registration.</p>
                        <a href="${process.env.CLIENT_URL}/activate/${token}" style="padding: 15px 20px; background-color: green; color: #fff;border: none; border-radius: 4px; text-decoration: none">Activate</a> 
                        <p>Not able to click the button above? Use the link below</p>
                        <p>${process.env.CLIENT_URL}/activate/${token}</p>
                      </div>
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
