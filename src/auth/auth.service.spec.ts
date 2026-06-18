import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

type AnyFn = jest.Mock;

function makePrisma() {
  return {
    user: { findUnique: jest.fn() },
    emailOtp: {
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
}

function makeJwt() {
  return { sign: jest.fn(), verify: jest.fn() };
}

function makeMail() {
  return { sendOtp: jest.fn(), sendFollowUp: jest.fn() };
}

function build() {
  const prisma = makePrisma();
  const jwt = makeJwt();
  const mail = makeMail();
  const service = new AuthService(prisma as any, jwt as any, mail as any);
  return { service, prisma, jwt, mail };
}

describe('AuthService OTP', () => {
  describe('requestOtp', () => {
    it('rejects an already-registered email', async () => {
      const { service, prisma, mail } = build();
      (prisma.user.findUnique as AnyFn).mockResolvedValue({ id: 'u1' });
      await expect(service.requestOtp('a@b.com')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mail.sendOtp).not.toHaveBeenCalled();
    });

    it('rejects a resend within the cooldown window', async () => {
      const { service, prisma, mail } = build();
      (prisma.user.findUnique as AnyFn).mockResolvedValue(null);
      (prisma.emailOtp.findFirst as AnyFn).mockResolvedValue({ id: 'o1' });
      await expect(service.requestOtp('a@b.com')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mail.sendOtp).not.toHaveBeenCalled();
    });

    it('creates and emails a code on the happy path', async () => {
      const { service, prisma, mail } = build();
      (prisma.user.findUnique as AnyFn).mockResolvedValue(null);
      (prisma.emailOtp.findFirst as AnyFn).mockResolvedValue(null);
      (prisma.emailOtp.deleteMany as AnyFn).mockResolvedValue({ count: 0 });
      (prisma.emailOtp.create as AnyFn).mockResolvedValue({ id: 'o1' });

      const res = await service.requestOtp('a@b.com');

      expect(res).toEqual({ ok: true });
      expect(prisma.emailOtp.create).toHaveBeenCalled();
      expect(mail.sendOtp).toHaveBeenCalledWith('a@b.com', expect.any(String));
      const code = (mail.sendOtp as AnyFn).mock.calls[0][1] as string;
      expect(code).toMatch(/^\d{6}$/);
    });
  });

  describe('verifyOtp', () => {
    it('fails when no code exists', async () => {
      const { service, prisma } = build();
      (prisma.emailOtp.findFirst as AnyFn).mockResolvedValue(null);
      await expect(service.verifyOtp('a@b.com', '123456')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('fails on an expired code', async () => {
      const { service, prisma } = build();
      (prisma.emailOtp.findFirst as AnyFn).mockResolvedValue({
        id: 'o1',
        codeHash: 'x',
        expiresAt: new Date(Date.now() - 1000),
        attempts: 0,
      });
      await expect(service.verifyOtp('a@b.com', '123456')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('fails after too many attempts', async () => {
      const { service, prisma } = build();
      (prisma.emailOtp.findFirst as AnyFn).mockResolvedValue({
        id: 'o1',
        codeHash: 'x',
        expiresAt: new Date(Date.now() + 10000),
        attempts: 5,
      });
      await expect(service.verifyOtp('a@b.com', '123456')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('increments attempts and rejects a wrong code', async () => {
      const { service, prisma } = build();
      const hash = await bcrypt.hash('654321', 10);
      (prisma.emailOtp.findFirst as AnyFn).mockResolvedValue({
        id: 'o1',
        codeHash: hash,
        expiresAt: new Date(Date.now() + 10000),
        attempts: 0,
      });
      (prisma.emailOtp.update as AnyFn).mockResolvedValue({});
      await expect(service.verifyOtp('a@b.com', '123456')).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.emailOtp.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: { attempts: 1 },
      });
    });

    it('consumes the code and returns a verifyToken on success', async () => {
      const { service, prisma, jwt } = build();
      const hash = await bcrypt.hash('123456', 10);
      (prisma.emailOtp.findFirst as AnyFn).mockResolvedValue({
        id: 'o1',
        codeHash: hash,
        expiresAt: new Date(Date.now() + 10000),
        attempts: 0,
      });
      (prisma.emailOtp.update as AnyFn).mockResolvedValue({});
      (jwt.sign as AnyFn).mockReturnValue('signed.jwt.token');

      const res = await service.verifyOtp('a@b.com', '123456');

      expect(res).toEqual({ verifyToken: 'signed.jwt.token' });
      expect(prisma.emailOtp.update).toHaveBeenCalledWith({
        where: { id: 'o1' },
        data: { consumedAt: expect.any(Date) },
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { email: 'a@b.com', purpose: 'register' },
        { expiresIn: '15m' },
      );
    });
  });

  describe('register verification gate', () => {
    const dto = {
      email: 'a@b.com',
      name: 'Aa',
      password: 'secret1',
      verifyToken: 't',
    };

    it('rejects an invalid verifyToken', async () => {
      const { service, jwt } = build();
      (jwt.verify as AnyFn).mockImplementation(() => {
        throw new Error('bad token');
      });
      await expect(service.register(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects a token whose email does not match', async () => {
      const { service, jwt } = build();
      (jwt.verify as AnyFn).mockReturnValue({
        email: 'other@b.com',
        purpose: 'register',
      });
      await expect(service.register(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects a token with the wrong purpose', async () => {
      const { service, jwt } = build();
      (jwt.verify as AnyFn).mockReturnValue({
        email: 'a@b.com',
        purpose: 'login',
      });
      await expect(service.register(dto)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
