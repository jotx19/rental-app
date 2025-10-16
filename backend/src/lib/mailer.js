import { Resend } from "resend";

const sendMail = async (recipient, subject, otp) => {
  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Code</title>
  <style>
    body {
      font-family: 'Verdana', sans-serif;
      background-color: #09090b;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #09090b;
      border-radius: 40px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1, p { color: #ffffff; }
    p { font-size: 16px; line-height: 1.5; }
    .otp {
      display: block;
      width: 120px;
      margin: 20px auto;
      background-color: #333;
      color: #ffffff;
      font-size: 24px;
      text-align: center;
      line-height: 50px;
      border-radius: 10px;
      font-weight: bold;
    }
    .cta-button {
      display: block;
      width: 150px;
      margin: 20px auto;
      padding: 12px;
      background-color: #ffffff;
      color: #000000;
      text-align: center;
      text-decoration: none;
      border-radius: 50px;
    }
    .cta-button:hover {
      background-color: #c0392b;
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>VERIFICATION CODE</h1>
    <p>Your One-Time Password (OTP) for verification:</p>
    <div class="otp">${otp}</div>
    <p>This OTP is valid for 20 minutes.</p>
    <a href="https://othousing.vercel.app" class="cta-button">Verify Now</a>
  </div>
</body>
</html>
`;

    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "OTHousing <onboarding@resend.dev>",
      to: recipient,
      subject,
      html,
    });

    console.log("✅ Email sent successfully to:", recipient);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendMail;
