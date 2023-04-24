import { get } from "./get";

export async function GET(request: Request) {
  const res = await get();
  const resJson = JSON.stringify(res);
  return new Response(resJson);
}
