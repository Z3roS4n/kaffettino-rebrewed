import { User, Wallet } from "../generated/prisma/client.js";
import { prisma } from "../plugins/prisma.js";
import { LogMethod } from "./decorators/logmethod.js";

export interface IGetUser extends User {
  wallets?: Wallet[];
}

interface ISetUserData {
  aulettaId: number;
}

class UserHandler {
  private prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }

  @LogMethod
  /**
   * Retrieves a user by their unique identifier.
   *
   * @param userId - The unique identifier of the user to retrieve.
   * @param includeWallets - Optional flag to include the user's wallets in the result.
   * @returns A promise that resolves to the user object, optionally including wallets.
   * @throws Error if the user is not found.
   */
  async getUser(userId: string, includeWallets?: boolean): Promise<IGetUser> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wallets: includeWallets ?? false,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  @LogMethod
  async setUserData(userId: string, userData: ISetUserData) {}
}

const userHandler = new UserHandler();
export default userHandler;
