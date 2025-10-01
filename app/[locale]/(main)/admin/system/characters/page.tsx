import { CharactersManagement } from "@/components/admin/characters-management";
import { Character, getCharacters } from "@/lib/api/characters/characters.api";
import { auth } from "@/lib/auth/auth";
import { GlobalPermission } from "@/lib/auth/constants";
import {
    getMasterDataPermissions,
    hasGlobalPermission,
} from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

interface CharactersPageProps {
    params: Promise<{ locale: string }>;
}

async function fetchCharacters(): Promise<Character[]> {
    try {
        const response = await getCharacters({ page: 1, page_size: 100 });

        if (response.success) {
            return response.data.data;
        } else {
            console.error(
                "Failed to fetch characters:",
                response.error?.description || response.message,
            );
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch characters:", error);
        return [];
    }
}

export default async function CharactersPage({
    params: paramsPromise,
}: CharactersPageProps) {
    const params = await paramsPromise;

    // Check permissions on server side
    const session = await auth();

    if (!hasGlobalPermission(session, GlobalPermission.CHARACTER_VIEW)) {
        redirect(`/${params.locale}/auth/signin`);
    }

    // Get user permissions
    const userPermissions = getMasterDataPermissions(session, "CHARACTER");
    const permissions = {
        canView: true, // Already checked above
        canCreate: userPermissions.includes(GlobalPermission.CHARACTER_CREATE),
        canUpdate: userPermissions.includes(GlobalPermission.CHARACTER_UPDATE),
        canDelete: userPermissions.includes(GlobalPermission.CHARACTER_DELETE),
    };

    // Fetch data on server side
    const initialCharacters = await fetchCharacters();

    return (
        <CharactersManagement
            initialCharacters={initialCharacters}
            locale={params.locale}
            permissions={permissions}
        />
    );
}
