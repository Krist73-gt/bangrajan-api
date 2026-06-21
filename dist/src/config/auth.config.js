import { betterAuth } from 'better-auth';
import nodemailer from 'nodemailer';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema/index.js';
let authInstance = null;
export function createAuth(databaseUrl, betterAuthUrl, secret) {
    if (authInstance)
        return authInstance;
    const client = postgres(databaseUrl);
    const db = drizzle(client, { schema });
    authInstance = betterAuth({
        database: drizzleAdapter(db, {
            provider: 'pg',
            schema: {
                user: schema.user,
                session: schema.session,
                account: schema.account,
                verification: schema.verification,
            },
        }),
        baseURL: betterAuthUrl,
        secret,
        emailAndPassword: {
            enabled: true,
            sendResetPassword: async ({ user, url, token }, request) => {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '465'),
                    secure: true,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });
                if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
                    console.log(`\n========================================================`);
                    console.log(`[PERINGATAN SMTP] .env SMTP_USER belum diatur!`);
                    console.log(`Silakan minta konfigurasi App Password di Gmail atau gunakan terminal ini untuk dev.`);
                    console.log(`Link Reset: ${url}`);
                    console.log(`========================================================\n`);
                    return;
                }
                try {
                    await transporter.sendMail({
                        from: `"Bangrajan Muaythai" <${process.env.SMTP_USER}>`,
                        to: user.email,
                        subject: 'Reset Password Akun Bangrajan Muaythai Anda 🥊',
                        html: `
              <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #111827; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <h2 style="color: #ef4444; margin-bottom: 24px;">Bangrajan Muaythai</h2>
                <p style="font-size: 16px;">Halo <strong>${user.name}</strong>,</p>
                <p style="font-size: 16px;">Kami menerima permintaan untuk mengatur ulang password Anda. Jika ini Anda, silakan klik tombol di bawah ini:</p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${url}" style="background-color: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Atur Ulang Password</a>
                </div>
                <p style="font-size: 14px;">Atau salin tautan berikut ke browser Anda:<br/>
                <a href="${url}" style="color: #3b82f6; word-break: break-all;">${url}</a></p>
                <p style="font-size: 14px; color: #6b7280; margin-top: 32px;">Jika Anda tidak membuat permintaan ini, Anda bisa mengabaikan email ini dengan aman.</p>
              </div>
            `
                    });
                    console.log(`Email reset password berhasil dikirim ke: ${user.email}`);
                }
                catch (error) {
                    console.error('[ERROR SMTP] Gagal mengirim email:', error);
                }
            },
        },
        user: {
            additionalFields: {
                phone: {
                    type: 'string',
                    required: false,
                    input: true,
                },
                role: {
                    type: 'string',
                    required: false,
                    defaultValue: 'member',
                    input: false,
                },
            },
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7,
            updateAge: 60 * 60 * 24,
        },
        trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    });
    return authInstance;
}
export function getAuth() {
    if (!authInstance) {
        throw new Error('Auth not initialized. Call createAuth() first.');
    }
    return authInstance;
}
//# sourceMappingURL=auth.config.js.map