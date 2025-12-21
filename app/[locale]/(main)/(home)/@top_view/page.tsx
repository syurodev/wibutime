// Fake loading - delay 2 seconds then show content
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function TopViewSection() {
  await delay(2000); // 2 second delay to show loading state

  // Uncomment to test error state:
  // throw new Error("Failed to fetch top view rankings");

  return <div className="p-4">Top View Section - Loaded!</div>;
}
