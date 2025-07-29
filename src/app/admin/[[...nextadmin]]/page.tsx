import { PromisePageProps } from "@premieroctet/next-admin"; import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import PageLoader from "@premieroctet/next-admin/pageLoader";
import { PrismaClient } from "@/generated/prisma/client";
import "../../../../nextAdminCss.css";
import options from "../../../../nextAdminOptions";

const prisma = new PrismaClient();

export default async function AdminPage(props: PromisePageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const nextAdminProps = await getNextAdminProps({
    params: params.nextadmin,
    searchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma,
    options
  });

  return (
    <NextAdmin pageLoader={<PageLoader />} {...nextAdminProps} />
  );
}
