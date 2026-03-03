import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // This runs when new users sign up to create their default playbook configs
  console.log('Seed ready - playbooks will be created per user');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });