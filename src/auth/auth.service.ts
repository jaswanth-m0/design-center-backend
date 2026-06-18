import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mail: MailService,
  ) {}

  async requestOtp(email: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email already registered');

    const recent = await this.prisma.emailOtp.findFirst({
      where: { email, createdAt: { gt: new Date(Date.now() - OTP_RESEND_MS) } },
    });
    if (recent) {
      throw new BadRequestException('Please wait a moment before requesting another code');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 10);
    await this.prisma.emailOtp.deleteMany({ where: { email, consumedAt: null } });
    await this.prisma.emailOtp.create({
      data: { email, codeHash, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
    });
    await this.mail.sendOtp(email, code);
    return { ok: true };
  }

  async verifyOtp(email: string, code: string) {
    const otp = await this.prisma.emailOtp.findFirst({
      where: { email, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) {
      throw new BadRequestException('No verification code found. Request a new one.');
    }
    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('Code expired. Request a new one.');
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new BadRequestException('Too many attempts. Request a new code.');
    }
    const valid = await bcrypt.compare(code, otp.codeHash);
    if (!valid) {
      await this.prisma.emailOtp.update({
        where: { id: otp.id },
        data: { attempts: otp.attempts + 1 },
      });
      throw new BadRequestException('Invalid code');
    }
    await this.prisma.emailOtp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });
    const verifyToken = this.jwt.sign(
      { email, purpose: 'register' },
      { expiresIn: '15m' },
    );
    return { verifyToken };
  }

  private assertEmailVerified(verifyToken: string, email: string) {
    let payload: { email?: string; purpose?: string };
    try {
      payload = this.jwt.verify(verifyToken);
    } catch {
      throw new UnauthorizedException('Email verification expired. Please verify again.');
    }
    if (payload.purpose !== 'register' || payload.email !== email) {
      throw new UnauthorizedException('Email verification is invalid.');
    }
  }

  private async buildResponse(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    const token = this.jwt.sign({
      sub: user!.id,
      role: user!.role,
      email: user!.email,
    });
    return {
      token,
      user: {
        id: user!.id,
        email: user!.email,
        role: user!.role,
        name: user!.profile?.name ?? null,
        vendorId: user!.profile?.vendorId ?? null,
      },
    };
  }

  async register(dto: RegisterDto) {
    this.assertEmailVerified(dto.verifyToken, dto.email);
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: Role.customer,
        profile: { create: { name: dto.name } },
      },
    });
    return this.buildResponse(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.buildResponse(user.id);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.profile?.name ?? null,
      vendorId: user.profile?.vendorId ?? null,
    };
  }

  async createUser(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already registered');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
        profile: { create: { name: dto.name } },
      },
    });
    return this.buildResponse(user.id);
  }
}
