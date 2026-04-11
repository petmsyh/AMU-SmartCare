import { PrismaClient, Role, DoctorTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin1234!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amu.edu' },
    update: {},
    create: {
      email: 'admin@amu.edu',
      username: 'admin',
      passwordHash: adminPassword,
      role: Role.admin,
      isVerified: true,
    },
  });
  console.log('Created admin:', admin.email);

  // Sample patient
  const patientPassword = await bcrypt.hash('Patient1234!', 12);
  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      username: 'john_patient',
      passwordHash: patientPassword,
      role: Role.patient,
      isVerified: true,
      wallet: { create: { balance: 500 } },
    },
  });
  console.log('Created patient:', patient.email);

  // Doctor 1
  const doctor1Password = await bcrypt.hash('Doctor1234!', 12);
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.smith@amu.edu' },
    update: {},
    create: {
      email: 'dr.smith@amu.edu',
      username: 'dr_smith',
      passwordHash: doctor1Password,
      role: Role.doctor,
      isVerified: true,
      wallet: { create: { balance: 0 } },
      doctorProfile: {
        create: {
          fullName: 'Dr. John Smith',
          specialty: 'Cardiology',
          experience: 10,
          bio: 'Experienced cardiologist with 10 years of practice.',
          consultationFee: 150,
          tier: DoctorTier.Specialist,
          certifications: ['MBBS', 'MD Cardiology'],
          availabilitySchedule: {
            monday: ['09:00-12:00', '14:00-17:00'],
            tuesday: ['09:00-12:00'],
            wednesday: ['14:00-17:00'],
          },
        },
      },
    },
  });
  console.log('Created doctor 1:', doctor1.email);

  // Doctor 2
  const doctor2Password = await bcrypt.hash('Doctor1234!', 12);
  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.jones@amu.edu' },
    update: {},
    create: {
      email: 'dr.jones@amu.edu',
      username: 'dr_jones',
      passwordHash: doctor2Password,
      role: Role.doctor,
      isVerified: true,
      wallet: { create: { balance: 0 } },
      doctorProfile: {
        create: {
          fullName: 'Dr. Sarah Jones',
          specialty: 'Dermatology',
          experience: 7,
          bio: 'Specialist in skin disorders and cosmetic dermatology.',
          consultationFee: 120,
          tier: DoctorTier.Specialist,
          certifications: ['MBBS', 'MD Dermatology'],
          availabilitySchedule: {
            monday: ['10:00-13:00'],
            thursday: ['09:00-12:00', '15:00-18:00'],
            friday: ['09:00-12:00'],
          },
        },
      },
    },
  });
  console.log('Created doctor 2:', doctor2.email);

  // Doctor 3
  const doctor3Password = await bcrypt.hash('Doctor1234!', 12);
  const doctor3 = await prisma.user.upsert({
    where: { email: 'dr.patel@amu.edu' },
    update: {},
    create: {
      email: 'dr.patel@amu.edu',
      username: 'dr_patel',
      passwordHash: doctor3Password,
      role: Role.doctor,
      isVerified: true,
      wallet: { create: { balance: 0 } },
      doctorProfile: {
        create: {
          fullName: 'Dr. Raj Patel',
          specialty: 'General Medicine',
          experience: 15,
          bio: 'General practitioner with broad clinical experience.',
          consultationFee: 80,
          tier: DoctorTier.GeneralPractitioner,
          certifications: ['MBBS'],
          availabilitySchedule: {
            monday: ['08:00-12:00', '14:00-18:00'],
            tuesday: ['08:00-12:00', '14:00-18:00'],
            wednesday: ['08:00-12:00'],
            thursday: ['08:00-12:00', '14:00-18:00'],
            friday: ['08:00-12:00'],
          },
        },
      },
    },
  });
  console.log('Created doctor 3:', doctor3.email);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
