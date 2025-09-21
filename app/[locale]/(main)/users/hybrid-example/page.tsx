import { getNavConfig } from "@/components/layout/nav/nav-configs";
import NavigationSetter from "@/components/layout/nav/navigation-setter";
import HybridClientActions from "./hybrid-client-actions";

// Server-side data fetching
async function getUserProfile(id: string = "1") {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
        id,
        name: "John Doe",
        email: "john@example.com",
        bio: "Software developer passionate about creating amazing user experiences.",
        location: "San Francisco, CA",
        joinDate: "2023-01-15",
        posts: 42,
        followers: 1205,
        following: 189,
    };
}

async function getUserPosts() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 150));

    return [
        {
            id: 1,
            title: "Getting started with Next.js 15",
            excerpt: "Learn the new features and improvements in Next.js 15...",
            date: "2024-01-20",
            likes: 25,
        },
        {
            id: 2,
            title: "Building scalable React applications",
            excerpt: "Best practices for structuring large React projects...",
            date: "2024-01-15",
            likes: 18,
        },
        {
            id: 3,
            title: "TypeScript tips and tricks",
            excerpt: "Advanced TypeScript patterns for better development...",
            date: "2024-01-10",
            likes: 31,
        },
    ];
}

export default async function HybridExamplePage() {
    // Server-side API calls - executed before page render
    const [userProfile, userPosts] = await Promise.all([
        getUserProfile(),
        getUserPosts(),
    ]);

    // Base navigation items
    const baseNavItems = getNavConfig("profile");

    return (
        <>
            <NavigationSetter items={baseNavItems} />

            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">
                    Hybrid Server + Client Example
                </h1>

                {/* Server-rendered Profile Section */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div>
                            <h2 className="text-xl font-semibold">
                                {userProfile.name}
                            </h2>
                            <p className="text-gray-600">{userProfile.email}</p>
                            <p className="text-sm text-gray-500">
                                Joined {userProfile.joinDate}
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4">{userProfile.bio}</p>
                    <p className="text-gray-600 mb-4">
                        📍 {userProfile.location}
                    </p>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold">
                                {userProfile.posts}
                            </div>
                            <div className="text-sm text-gray-600">Posts</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {userProfile.followers}
                            </div>
                            <div className="text-sm text-gray-600">
                                Followers
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {userProfile.following}
                            </div>
                            <div className="text-sm text-gray-600">
                                Following
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Component for Interactive Actions */}
                <HybridClientActions userProfile={userProfile} />

                {/* Server-rendered Posts Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Recent Posts (Server Data)
                    </h3>
                    <div className="space-y-4">
                        {userPosts.map((post) => (
                            <div
                                key={post.id}
                                className="border-l-4 border-blue-500 pl-4"
                            >
                                <h4 className="font-medium">{post.title}</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    {post.excerpt}
                                </p>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{post.date}</span>
                                    <span>❤️ {post.likes} likes</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">
                        Hybrid Approach Benefits:
                    </h3>
                    <ul className="text-sm text-green-800 space-y-1">
                        <li>✅ Server: Fast initial page load with data</li>
                        <li>✅ Client: Interactive UI components</li>
                        <li>✅ Server: SEO-friendly content</li>
                        <li>✅ Client: Dynamic navigation with state</li>
                        <li>✅ Best of both worlds</li>
                    </ul>
                </div>
            </div>
        </>
    );
}
