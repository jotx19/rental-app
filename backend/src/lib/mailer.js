import nodemailer from "nodemailer";

const sendMail = async (recipient, subject, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Email</title>
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
        h1, p {
            color: #ffffff;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .otp-container {
            display: flex;
            justify-content: center;
            gap: 15px;
            padding: 20px 0;
        }
        .otp {
            display: block;
            width: 120px;
            margin: 20px auto;
            background-color: #333;
            color: #ffffff;
            font-size: 24px;
            text-align: center;
            text-decoration: none;
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
        <p>Your One-Time Password (OTP) for verification</p>
        <div class="otp-container">
            <div class="otp">${otp}</div>
        </div>
        <p>This OTP is valid for 20 minutes.</p>
        <a href="https://ottawahousing.up.railway.app/" class="cta-button">Verify Now</a>
    </div>
</body>
</html>

      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

export default sendMail;
