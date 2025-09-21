import NavigationSetter from "@/components/layout/nav/navigation-setter";
import { createLinkItem } from "@/hooks/use-nav-config";

// Simulate API call
async function getUserData() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        isFollowing: false,
        followers: 150,
        following: 89,
    };
}

async function getUsersList() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 50));

    return [
        { id: 1, name: "John Doe", status: "active" },
        { id: 2, name: "Jane Smith", status: "inactive" },
        { id: 3, name: "Bob Wilson", status: "active" },
    ];
}

export default async function ServerExamplePage() {
    // Server-side API calls
    const userData = await getUserData();
    const usersList = await getUsersList();

    // Static navigation for this server component
    const baseNavItems = [
        createLinkItem({
            icon: "Home",
            href: "/",
            label: "Home",
        }),
        createLinkItem({
            icon: "Users",
            href: "/users",
            label: "All Users",
        }),
    ];

    return (
        <>
            <NavigationSetter items={baseNavItems} />

            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">
                    Server Component Example
                </h1>

                {/* User Profile Section */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        User Profile (Server Data)
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p>
                                <strong>Name:</strong> {userData.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {userData.email}
                            </p>
                            <p>
                                <strong>Following Status:</strong>{" "}
                                {userData.isFollowing
                                    ? "Following"
                                    : "Not Following"}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Followers:</strong> {userData.followers}
                            </p>
                            <p>
                                <strong>Following:</strong> {userData.following}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Users List Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">
                        Users List (Server Data)
                    </h2>
                    <div className="space-y-2">
                        {usersList.map((user) => (
                            <div
                                key={user.id}
                                className="flex justify-between items-center p-3 border rounded"
                            >
                                <span>{user.name}</span>
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        user.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {user.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">
                        Server Component Features:
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>✅ API calls executed on server</li>
                        <li>✅ Data fetched before page render</li>
                        <li>✅ Static navigation items</li>
                        <li>✅ Better SEO and performance</li>
                        <li>✅ No loading states needed</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
