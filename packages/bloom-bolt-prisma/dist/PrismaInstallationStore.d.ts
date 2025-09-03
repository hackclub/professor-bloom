import { Installation, InstallationQuery, InstallationStore, Logger } from '@slack/oauth';
import PrismaInstallationStoreArgs from './PrismaInstallationStoreArgs';
export default class PrismaInstallationStore implements InstallationStore {
    private prismaClient?;
    private prismaTable;
    private clientId?;
    private logger;
    private historicalDataEnabled;
    private onFetchInstallation;
    private onStoreInstallation;
    private onDeleteInstallation;
    constructor(options: PrismaInstallationStoreArgs);
    storeInstallation<AuthVersion extends 'v1' | 'v2'>(i: Installation<AuthVersion, boolean>, logger?: Logger): Promise<void>;
    fetchInstallation(query: InstallationQuery<boolean>, logger?: Logger): Promise<Installation<'v1' | 'v2', boolean>>;
    deleteInstallation(query: InstallationQuery<boolean>, logger?: Logger): Promise<void>;
    close(): Promise<void>;
    private buildBotQuery;
    private buildFullWhereClause;
}
//# sourceMappingURL=PrismaInstallationStore.d.ts.map