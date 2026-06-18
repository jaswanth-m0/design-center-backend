import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { followUpEmail, otpEmail } from './templates';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private config: ConfigService) {}

  /** Lazily build the SMTP transport so the app boots without mail configured. */
  private getTransport(): Transporter {
    if (this.transporter) return this.transporter;
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    if (!host || !user || !pass) {
      throw new Error(
        'Email service is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS).',
      );
    }
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    return this.transporter;
  }

  private get from(): string {
    return this.config.get<string>('MAIL_FROM') ?? 'no-reply@designcenter.app';
  }

  async sendOtp(email: string, code: string): Promise<void> {
    const { subject, text, html } = otpEmail(code);
    await this.getTransport().sendMail({ from: this.from, to: email, subject, text, html });
    this.logger.log(`OTP email sent to ${email}`);
  }

  async sendFollowUp(to: string, name: string): Promise<void> {
    const { subject, text, html } = followUpEmail(name);
    await this.getTransport().sendMail({ from: this.from, to, subject, text, html });
    this.logger.log(`Follow-up email sent to ${to}`);
  }
}
