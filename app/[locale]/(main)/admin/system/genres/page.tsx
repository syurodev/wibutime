import { GenresManagement } from "@/components/admin/genres-management";
import { Genre, getGenres } from "@/lib/api/genres/genres.api";
import { auth } from "@/lib/auth/auth";
import { GlobalPermission } from "@/lib/auth/constants";
import {
    getMasterDataPermissions,
    hasGlobalPermission,
} from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

interface GenresPageProps {
    params: Promise<{ locale: string }>;
}

async function fetchGenres(): Promise<Genre[]> {
    try {
        const response = await getGenres({ page: 1, page_size: 100 });

        if (response.success) {
            return response.data.data;
        } else {
            console.error(
                "Failed to fetch genres:",
                response.error?.description || response.message,
            );
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch genres:", error);
        return [];
    }
}

export default async function GenresPage({
    params: paramsPromise,
}: GenresPageProps) {
    const params = await paramsPromise;

    // Check permissions on server side
    const session = await auth();

    if (!hasGlobalPermission(session, GlobalPermission.GENRE_VIEW)) {
        redirect(`/${params.locale}/auth/signin`);
    }

    // Get user permissions
    const userPermissions = getMasterDataPermissions(session, "GENRE");
    const permissions = {
        canView: true, // Already checked above
        canCreate: userPermissions.includes(GlobalPermission.GENRE_CREATE),
        canUpdate: userPermissions.includes(GlobalPermission.GENRE_UPDATE),
        canDelete: userPermissions.includes(GlobalPermission.GENRE_DELETE),
    };

    // Fetch data on server side
    const initialGenres = await fetchGenres();

    return (
        <GenresManagement
            initialGenres={initialGenres}
            locale={params.locale}
            permissions={permissions}
        />
    );
}
