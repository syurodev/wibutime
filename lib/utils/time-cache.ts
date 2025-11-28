import { cacheLife } from "next/cache";

export async function getCurrentTime() {
  "use cache";
  cacheLife("minutes");
  return Date.now();
}
