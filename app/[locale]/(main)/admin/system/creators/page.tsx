import { hasGlobalPermission, getMasterDataPermissions } from "@/lib/auth/permissions";
import { GlobalPermission } from "@/lib/auth/constants";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Palette } from "lucide-react";

interface CreatorsPageProps {
    params: Promise<{ locale: string }>;
}

export default async function CreatorsPage({ params }: CreatorsPageProps) {
    const session = await auth();
    const { locale } = await params;

    if (!hasGlobalPermission(session, GlobalPermission.CREATOR_VIEW)) {
        redirect(`/${locale}/auth/signin`);
    }

    const userPermissions = getMasterDataPermissions(session, "CREATOR");
    const canCreate = userPermissions.includes(GlobalPermission.CREATOR_CREATE);
    const canUpdate = userPermissions.includes(GlobalPermission.CREATOR_UPDATE);
    const canDelete = userPermissions.includes(GlobalPermission.CREATOR_DELETE);

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/system"
                            className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to System
                        </Link>
                        <div className="flex items-center">
                            <Palette className="w-6 h-6 text-purple-600 mr-2" />
                            <h1 className="text-3xl font-bold">Creators Management</h1>
                        </div>
                    </div>
                    {canCreate && (
                        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Creator
                        </button>
                    )}
                </div>

                {/* Permissions Info */}
                <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Your Permissions:</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            View: ✓
                        </span>
                        <span className={`px-2 py-1 rounded ${canCreate ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            Create: {canCreate ? '✓' : '✗'}
                        </span>
                        <span className={`px-2 py-1 rounded ${canUpdate ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            Update: {canUpdate ? '✓' : '✗'}
                        </span>
                        <span className={`px-2 py-1 rounded ${canDelete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            Delete: {canDelete ? '✓' : '✗'}
                        </span>
                    </div>
                </div>

                {/* Creator Types Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-blue-900">Creator Types:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                        {['AUTHOR', 'ILLUSTRATOR', 'ARTIST', 'STUDIO', 'VOICE_ACTOR'].map(type => (
                            <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-center">
                                {type.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Creators Table Placeholder */}
                <div className="bg-card border rounded-lg p-8 text-center">
                    <Palette className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Creators Table</h3>
                    <p className="text-muted-foreground mb-4">
                        This is where the creators data table will be implemented.
                    </p>
                    <div className="text-sm text-muted-foreground">
                        <strong>API Endpoint:</strong> GET /api/v1/creators
                        <br />
                        <strong>Backend:</strong> Ready ✓
                        <br />
                        <strong>Frontend Table:</strong> To be implemented
                        <br />
                        <strong>Note:</strong> Creators can have multiple roles (AUTHOR, ARTIST, STUDIO, etc.)
                    </div>
                </div>
            </div>
        </div>
    );
}