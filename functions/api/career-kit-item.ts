import { WebflowClient, WebflowEnvironment } from "webflow-api";

interface Env {
  WEBFLOW_CMS: string;
}
const CAREER_KITS_ID = "6a50ce9298b9d95d3f117dd7"

export const onRequestGet = async ({ env, request }: { env: Env; request: Request }) => {
  const url = new URL(request.url);
  const itemId = url.searchParams.get("id");

  if (!itemId) {
    return Response.json({ message: "Missing id query param" }, { status: 400 });
  }

  const client = new WebflowClient({ environment: WebflowEnvironment.DataApi, accessToken: env.WEBFLOW_CMS });
  const item = await client.collections.items.getItemLive(CAREER_KITS_ID, itemId);
  return Response.json(item);
};
