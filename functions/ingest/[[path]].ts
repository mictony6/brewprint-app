const POSTHOG_HOST = "https://us.i.posthog.com"

export const onRequest: PagesFunction = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }

  const url = new URL(request.url)
  const targetUrl = POSTHOG_HOST + url.pathname.replace(/^\/ingest/, "") + url.search

  const proxiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })

  const response = await fetch(proxiedRequest)

  const proxiedResponse = new Response(response.body, response)
  proxiedResponse.headers.set("Access-Control-Allow-Origin", "*")
  return proxiedResponse
}
