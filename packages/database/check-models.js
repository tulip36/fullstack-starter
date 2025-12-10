// 检查Prisma客户端
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Available models:');
console.log(Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_')));

console.log('\nTable model exists:', !!prisma.table);
console.log('TableLayout model exists:', !!prisma.tableLayout);
console.log('Reservation model exists:', !!prisma.reservation);

console.log('\nTable methods:', Object.keys(prisma.table || {}));
console.log('TableLayout methods:', Object.keys(prisma.tableLayout || {}));
console.log('Reservation methods:', Object.keys(prisma.reservation || {}));