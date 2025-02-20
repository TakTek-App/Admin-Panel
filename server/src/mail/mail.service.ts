import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(to: string, userId: number) {
    const verificationLink = `${process.env.VERIFICATION_URL}/${userId}/verify`;

    const msg = {
      to,
      from: "tech@taktek.app",
      subject: 'Verify Your TakTek Account',
      html: `
        <h1>Verify Your Account</h1>
        <p>Click the button below to verify your email and activate your account:</p>
        <a href="${verificationLink}" style="background-color: #008CBA; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Verify My Account</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
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