import { CreatorsManagement } from "@/components/admin/creators-management";
import { Creator, getCreators } from "@/lib/api/creators/creators.api";
import { auth } from "@/lib/auth/auth";
import { GlobalPermission } from "@/lib/auth/constants";
import {
    getMasterDataPermissions,
    hasGlobalPermission,
} from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

interface CreatorsPageProps {
    params: Promise<{ locale: string }>;
}

async function fetchCreators(): Promise<Creator[]> {
    try {
        const response = await getCreators({ page: 1, page_size: 100 });

        if (response.success) {
            return response.data.data;
        } else {
            console.error(
                "Failed to fetch creators:",
                response.error?.description || response.message,
            );
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch creators:", error);
        return [];
    }
}

export default async function CreatorsPage({
    params: paramsPromise,
}: CreatorsPageProps) {
    const params = await paramsPromise;

    // Check permissions on server side
    const session = await auth();

    if (!hasGlobalPermission(session, GlobalPermission.CREATOR_VIEW)) {
        redirect(`/${params.locale}/auth/signin`);
    }

    // Get user permissions
    const userPermissions = getMasterDataPermissions(session, "CREATOR");
    const permissions = {
        canView: true, // Already checked above
        canCreate: userPermissions.includes(GlobalPermission.CREATOR_CREATE),
        canUpdate: userPermissions.includes(GlobalPermission.CREATOR_UPDATE),
        canDelete: userPermissions.includes(GlobalPermission.CREATOR_DELETE),
    };

    // Fetch data on server side
    const initialCreators = await fetchCreators();

    return (
        <CreatorsManagement
            initialCreators={initialCreators}
            locale={params.locale}
            permissions={permissions}
        />
    );
}
