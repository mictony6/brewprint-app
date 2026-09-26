import { WebflowClient } from "webflow-api";

interface Env {
  WEBFLOW_CMS: string;
}

export const onRequestGet = async ({ env }: { env: Env }) => {
  const client = new WebflowClient({ accessToken: env.WEBFLOW_CMS });
  const items = await client.collections.list("6a4e865922dfe2f015fd6d54");
  return Response.json(items);
};


