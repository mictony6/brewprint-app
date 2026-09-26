import { WebflowClient } from "webflow-api";

interface Env {
  WEBFLOW_CMS: string;
}
const CAREER_KITS_ID = "6a50ce9298b9d95d3f117dd7"
export const onRequestGet = async ({ env } : {env : Env}) => {
  const client = new WebflowClient({ accessToken: env.WEBFLOW_CMS });
  const items = await client.collections.items.listItems(CAREER_KITS_ID, {
        offset: 0,
        limit: 100,
    });
  return Response.json(items, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
};



