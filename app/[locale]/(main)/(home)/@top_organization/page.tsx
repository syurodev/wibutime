// Fake loading - delay 1.8 seconds then throw error
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function TopOrganizationSection() {
  await delay(1800); // 1.8 second delay

  // Throw error to test error state
  throw new Error("Network error: Unable to connect to API server");

  // return <div className="p-4">Top Organization Section - Loaded!</div>;
}
