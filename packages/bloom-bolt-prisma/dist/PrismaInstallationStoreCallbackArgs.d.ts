import { Logger } from '@slack/logger';
import { Installation, InstallationQuery } from '@slack/oauth';
export interface StoreInstallationCallbackArgs {
    prismaInput: any;
    installation: Installation;
    logger: Logger;
    query?: InstallationQuery<boolean>;
    idToUpdate?: number | string;
}
export interface FetchInstallationCallbackArgs {
    installation: Installation;
    logger: Logger;
    query: InstallationQuery<boolean>;
}
export interface DeleteInstallationCallbackArgs {
    logger: Logger;
    query: InstallationQuery<boolean>;
}
//# sourceMappingURL=PrismaInstallationStoreCallbackArgs.d.ts.map