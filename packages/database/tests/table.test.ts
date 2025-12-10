// 餐桌管理数据库集成测试
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

describe('Table Management', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // 清理测试数据
    try {
      await prisma.reservation.deleteMany();
      await prisma.table.deleteMany();
      await prisma.tableLayout.deleteMany();
    } catch (error) {
      // 忽略清理错误
    }
  });

  describe('Table CRUD Operations', () => {
    it('should create a table layout', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
          floorPlan: '{"tables": []}',
          isActive: true,
        },
      });

      expect(layout.id).toBeDefined();
      expect(layout.name).toBe('Main Floor');
      expect(layout.isActive).toBe(true);
    });

    it('should create a table', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      const table = await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
      });

      expect(table.id).toBeDefined();
      expect(table.tableNumber).toBe('T001');
      expect(table.capacity).toBe(4);
      expect(table.status).toBe('AVAILABLE');
    });

    it('should find table by number', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
      });

      const found = await prisma.table.findUnique({
        where: { tableNumber: 'T001' },
      });

      expect(found).toBeDefined();
      expect(found?.tableNumber).toBe('T001');
    });

    it('should update table status', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      const table = await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
      });

      const updated = await prisma.table.update({
        where: { id: table.id },
        data: { status: 'OCCUPIED' },
      });

      expect(updated.status).toBe('OCCUPIED');
    });

    it('should delete a table', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      const table = await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
      });

      await prisma.table.delete({
        where: { id: table.id },
      });

      const found = await prisma.table.findUnique({
        where: { tableNumber: 'T001' },
      });

      expect(found).toBeNull();
    });
  });

  describe('Table Relationships', () => {
    it('should create table with layout relationship', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      const table = await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
        include: {
          layout: true,
        },
      });

      expect(table.layout.name).toBe('Main Floor');
    });

    it('should create reservation for table', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      const table = await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
      });

      const reservation = await prisma.reservation.create({
        data: {
          tableId: table.id,
          customerName: 'John Doe',
          customerPhone: '+1234567890',
          partySize: 4,
          reservationTime: new Date('2025-12-10T19:00:00Z'),
        },
        include: {
          table: true,
        },
      });

      expect(reservation.customerName).toBe('John Doe');
      expect(reservation.table.tableNumber).toBe('T001');
      expect(reservation.status).toBe('PENDING');
    });
  });

  describe('Status Validation', () => {
    it('should accept valid table statuses', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      const validStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'OUT_OF_ORDER'];

      for (const status of validStatuses) {
        const table = await prisma.table.create({
          data: {
            tableNumber: `T${status}`,
            capacity: 4,
            section: 'main',
            status: status,
            layoutId: layout.id,
          },
        });
        expect(table.status).toBe(status);
      }
    });

    it('should accept valid reservation statuses', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      const table = await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
      });

      const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW'];

      for (const status of validStatuses) {
        const reservation = await prisma.reservation.create({
          data: {
            tableId: table.id,
            customerName: 'Test Customer',
            partySize: 2,
            reservationTime: new Date(),
            status: status,
          },
        });
        expect(reservation.status).toBe(status);
      }
    });
  });

  describe('Constraints', () => {
    it('should enforce unique table number', async () => {
      const layout = await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      await prisma.table.create({
        data: {
          tableNumber: 'T001',
          capacity: 4,
          section: 'main',
          layoutId: layout.id,
        },
      });

      await expect(
        prisma.table.create({
          data: {
            tableNumber: 'T001', // Duplicate
            capacity: 2,
            section: 'private',
            layoutId: layout.id,
          },
        })
      ).rejects.toThrow();
    });

    it('should enforce unique layout name', async () => {
      await prisma.tableLayout.create({
        data: {
          name: 'Main Floor',
        },
      });

      await expect(
        prisma.tableLayout.create({
          data: {
            name: 'Main Floor', // Duplicate
          },
        })
      ).rejects.toThrow();
    });
  });
});