import { WebflowClient } from "webflow-api";

interface Env {
  WEBFLOW_CMS: string;
}
const RESOURCES_ID = "6a50dbade9ffb15210e07402"
export const onRequestGet = async ({ env } : {env : Env}) => {
  const client = new WebflowClient({ accessToken: env.WEBFLOW_CMS });
  const items = await client.collections.items.listItems(RESOURCES_ID, {
        offset: 0,
        limit: 100,
    });
  return Response.json(items, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
};
