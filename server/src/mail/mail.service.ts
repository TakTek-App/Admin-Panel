import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  generateVerificationToken(userId: number) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  async sendVerificationEmail(to: string, userId: number) {
    const token = this.generateVerificationToken(userId);
    // const verificationLink = `${process.env.VERIFICATION_URL}/${userId}/verify`;
    const verificationLink = `${process.env.VERIFICATION_URL}?token=${token}`;

    const msg = {
      to,
      from: 'tech@taktek.app',
      subject: 'Verify Your TakTek Account',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Verify Your Account</title>
          <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 18px;
                color: #000;
                background-color: #fff !important;
                text-align: center;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
            }
            .header img {
                max-width: 100%;
                height: auto;
            }
            .divider {
                height: 2px;
                background-color: #000;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                padding: 12px 18px;
                font-size: 16px;
                color: #fff !important;
                background-color: #1d71bf;
                border-radius: 6px;
                text-decoration: none;
                text-align: center;
            }
                .button-container {
                text-align: center;
                margin-top: 20px;
            }
            .footer {
                font-size: 14px;
                color: #666;
                margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/bccfe24e399eb7cc5e99b3fbf48dff5f6c12cf15d7fdf3a0b608c3f456b06f69.png" alt="Logo">
            </div>
            <div class="divider"></div>
            <h1>Verify Your Account</h1>
            <p>Click the button below to verify your email and activate your account:</p>
            <div class="button-container">
              <a href="${verificationLink}" class="button">Verify My Account</a>
            </div>
            <p class="footer">If you didn’t request this, you can safely ignore this email.</p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error.response?.body || error);
    }
  }
}
