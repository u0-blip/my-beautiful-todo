import { PrismaClient } from "@/generated/prisma/client";
import { createHandler } from "@premieroctet/next-admin/appHandler";
import options from "../../../../../nextAdminOptions";

const prisma = new PrismaClient();
const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options
});
 
export { run as DELETE, run as GET, run as POST };
