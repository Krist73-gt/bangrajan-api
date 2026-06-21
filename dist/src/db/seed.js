import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';
async function seed() {
    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle(client, { schema });
    console.log('🌱 Seeding database...');
    console.log('  → Inserting packages...');
    const insertedPackages = await db
        .insert(schema.packages)
        .values([
        {
            name: '1x Visit',
            category: 'Pelajar',
            defaultSessions: 1,
            validityDays: 1,
            price: 60000,
            sortOrder: 1,
        },
        {
            name: '4x Sebulan',
            category: 'Pelajar',
            defaultSessions: 4,
            validityDays: 30,
            price: 225000,
            sortOrder: 2,
        },
        {
            name: '8x Sebulan',
            category: 'Pelajar',
            defaultSessions: 8,
            validityDays: 30,
            price: 350000,
            sortOrder: 3,
        },
        {
            name: '1x Visit',
            category: 'Dewasa',
            defaultSessions: 1,
            validityDays: 1,
            price: 75000,
            sortOrder: 4,
        },
        {
            name: '4x Sebulan',
            category: 'Dewasa',
            defaultSessions: 4,
            validityDays: 30,
            price: 250000,
            sortOrder: 5,
        },
        {
            name: '8x Sebulan',
            category: 'Dewasa',
            defaultSessions: 8,
            validityDays: 30,
            price: 400000,
            sortOrder: 6,
        },
        {
            name: '8x Ladies',
            category: 'Dewasa',
            defaultSessions: 8,
            validityDays: 30,
            price: 350000,
            sortOrder: 7,
        },
        {
            name: '26x Sebulan',
            category: 'Dewasa',
            defaultSessions: 26,
            validityDays: 30,
            price: 600000,
            sortOrder: 8,
        },
        {
            name: '1x Visit',
            category: 'Private',
            defaultSessions: 1,
            validityDays: 1,
            price: 150000,
            sortOrder: 9,
        },
        {
            name: '8x Paket',
            category: 'Private',
            defaultSessions: 8,
            validityDays: 30,
            price: 1000000,
            sortOrder: 10,
        },
    ])
        .returning();
    console.log(`    ✅ ${insertedPackages.length} packages inserted.`);
    console.log('  → Inserting schedules...');
    const insertedSchedules = await db
        .insert(schema.schedules)
        .values([
        {
            dayName: 'Senin',
            dayOrder: 0,
            openTime: null,
            closeTime: null,
            isHoliday: true,
        },
        {
            dayName: 'Selasa',
            dayOrder: 1,
            openTime: '09:00',
            closeTime: '21:00',
            isHoliday: false,
        },
        {
            dayName: 'Rabu',
            dayOrder: 2,
            openTime: '09:00',
            closeTime: '21:00',
            isHoliday: false,
        },
        {
            dayName: 'Kamis',
            dayOrder: 3,
            openTime: '09:00',
            closeTime: '21:00',
            isHoliday: false,
        },
        {
            dayName: 'Jumat',
            dayOrder: 4,
            openTime: '09:00',
            closeTime: '21:00',
            isHoliday: false,
        },
        {
            dayName: 'Sabtu',
            dayOrder: 5,
            openTime: '09:00',
            closeTime: '18:00',
            isHoliday: false,
        },
        {
            dayName: 'Minggu',
            dayOrder: 6,
            openTime: '09:00',
            closeTime: '21:00',
            isHoliday: false,
        },
    ])
        .returning();
    console.log(`    ✅ ${insertedSchedules.length} schedules inserted.`);
    console.log('  → Inserting gallery images...');
    const insertedGallery = await db
        .insert(schema.galleryImages)
        .values([
        {
            title: 'Indoor Training Area',
            imageUrl: '/images/gym-1.png',
            sortOrder: 1,
        },
        {
            title: 'Professional Boxing Ring',
            imageUrl: '/images/gym-2.png',
            sortOrder: 2,
        },
    ])
        .returning();
    console.log(`    ✅ ${insertedGallery.length} gallery images inserted.`);
    console.log('  → Inserting announcements...');
    const insertedAnnouncements = await db
        .insert(schema.announcements)
        .values([
        {
            title: 'Camp Libur Tanggal Merah',
            content: 'Pemberitahuan kepada seluruh member, camp akan tutup pada tanggal 1 Mei untuk libur nasional Hari Buruh. Latihan akan kembali normal pada 2 Mei.',
            type: 'Info',
            isActive: true,
        },
        {
            title: 'Promo Spesial Ramadhan!',
            content: 'Dapatkan tambahan 4 sesi gratis untuk setiap perpanjangan paket Dewasa selama bulan Ramadhan. Promo berlaku hingga akhir bulan.',
            type: 'Promo',
            isActive: true,
        },
    ])
        .returning();
    console.log(`    ✅ ${insertedAnnouncements.length} announcements inserted.`);
    console.log('  → Inserting sample member profiles...');
    const dewasa8x = insertedPackages.find((p) => p.category === 'Dewasa' && p.name === '8x Sebulan');
    const pelajar4x = insertedPackages.find((p) => p.category === 'Pelajar' && p.name === '4x Sebulan');
    const dewasaVisit = insertedPackages.find((p) => p.category === 'Dewasa' && p.name === '1x Visit');
    const dewasaLadies = insertedPackages.find((p) => p.category === 'Dewasa' && p.name === '8x Ladies');
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 20);
    const nearExpiry = new Date(today);
    nearExpiry.setDate(nearExpiry.getDate() + 2);
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 10);
    const insertedMembers = await db
        .insert(schema.memberProfiles)
        .values([
        {
            memberId: 'BR-2026-0042',
            fullName: 'Galih Pratama',
            phone: '081234567890',
            packageId: dewasa8x?.id ?? 6,
            remainingSessions: 7,
            expiryDate: futureDate.toISOString().split('T')[0],
            status: 'Aktif',
        },
        {
            memberId: 'BR-2026-0043',
            fullName: 'Rina Saputri',
            phone: '081234567891',
            packageId: pelajar4x?.id ?? 2,
            remainingSessions: 4,
            expiryDate: futureDate.toISOString().split('T')[0],
            status: 'Aktif',
        },
        {
            memberId: 'BR-2026-0044',
            fullName: 'Budi Kurniawan',
            phone: '081234567892',
            packageId: dewasaVisit?.id ?? 4,
            remainingSessions: 0,
            expiryDate: pastDate.toISOString().split('T')[0],
            status: 'Expired',
        },
        {
            memberId: 'BR-2026-0045',
            fullName: 'Sari Dewi',
            phone: '081234567893',
            packageId: dewasaLadies?.id ?? 7,
            remainingSessions: 1,
            expiryDate: nearExpiry.toISOString().split('T')[0],
            status: 'Warning',
        },
        {
            memberId: 'BR-2026-0046',
            fullName: 'Ahmad Fadli',
            phone: '081234567894',
            packageId: dewasa8x?.id ?? 6,
            remainingSessions: 3,
            expiryDate: nearExpiry.toISOString().split('T')[0],
            status: 'Aktif',
        },
    ])
        .returning();
    console.log(`    ✅ ${insertedMembers.length} member profiles inserted.`);
    console.log('\n✅ Seeding complete!');
    await client.end();
    process.exit(0);
}
seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map