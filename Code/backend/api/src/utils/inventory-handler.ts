import { prisma } from "../plugins/prisma";

class InventoryHandler {
  private prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  async listInventories() {}
  async getInventory() {}
  async insertProduct() {}
  async removeProduct() {}
  async assignAuletta() {}
}

const inventoryHandler = new InventoryHandler();
export default inventoryHandler;
