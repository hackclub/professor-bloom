"use strict";
/* eslint-disable import/prefer-default-export */
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@slack/logger");
class PrismaInstallationStore {
    constructor(options) {
        this.prismaClient = options.prismaClient;
        this.prismaTable = options.prismaTable;
        this.clientId = options.clientId;
        this.logger = options.logger !== undefined ?
            options.logger : new logger_1.ConsoleLogger();
        this.historicalDataEnabled = options.historicalDataEnabled !== undefined ?
            options.historicalDataEnabled : true;
        this.onFetchInstallation = options.onFetchInstallation !== undefined ?
            options.onFetchInstallation : async (_) => { };
        this.onStoreInstallation = options.onStoreInstallation !== undefined ?
            options.onStoreInstallation : async (_) => { };
        this.onDeleteInstallation = options.onDeleteInstallation !== undefined ?
            options.onDeleteInstallation : async (_) => { };
        this.logger.debug(`PrismaInstallationStore has been initialized (clientId: ${this.clientId})`);
    }
    // eslint-disable-next-line class-methods-use-this
    async storeInstallation(i, logger) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        const enterpriseId = (_a = i.enterprise) === null || _a === void 0 ? void 0 : _a.id;
        const teamId = (_b = i.team) === null || _b === void 0 ? void 0 : _b.id;
        const userId = i.user.id;
        const isEnterpriseInstall = i.isEnterpriseInstall || false;
        const commonLogPart = `(enterprise_id: ${enterpriseId}, team_id: ${teamId}, user_id: ${userId})`;
        logger === null || logger === void 0 ? void 0 : logger.debug(`#storeInstallation starts ${commonLogPart}`);
        const entity = {
            clientId: this.clientId,
            appId: i.appId,
            enterpriseId: (_c = i.enterprise) === null || _c === void 0 ? void 0 : _c.id,
            enterpriseName: (_d = i.enterprise) === null || _d === void 0 ? void 0 : _d.name,
            enterpriseUrl: i.enterpriseUrl,
            teamId: (_e = i.team) === null || _e === void 0 ? void 0 : _e.id,
            teamName: (_f = i.team) === null || _f === void 0 ? void 0 : _f.name,
            botToken: (_g = i.bot) === null || _g === void 0 ? void 0 : _g.token,
            botId: (_h = i.bot) === null || _h === void 0 ? void 0 : _h.id,
            botUserId: (_j = i.bot) === null || _j === void 0 ? void 0 : _j.userId,
            botScopes: (_l = (_k = i.bot) === null || _k === void 0 ? void 0 : _k.scopes) === null || _l === void 0 ? void 0 : _l.join(','),
            botRefreshToken: (_m = i.bot) === null || _m === void 0 ? void 0 : _m.refreshToken,
            botTokenExpiresAt: ((_o = i.bot) === null || _o === void 0 ? void 0 : _o.expiresAt) ?
                new Date(i.bot.expiresAt * 1000) :
                undefined,
            userId: i.user.id,
            userToken: i.user.token,
            userScopes: (_p = i.user.scopes) === null || _p === void 0 ? void 0 : _p.join(','),
            userRefreshToken: i.user.refreshToken,
            userTokenExpiresAt: ((_q = i.user) === null || _q === void 0 ? void 0 : _q.expiresAt) ?
                new Date(i.user.expiresAt * 1000) :
                undefined,
            incomingWebhookUrl: (_r = i.incomingWebhook) === null || _r === void 0 ? void 0 : _r.url,
            incomingWebhookChannel: (_s = i.incomingWebhook) === null || _s === void 0 ? void 0 : _s.channel,
            incomingWebhookChannelId: (_t = i.incomingWebhook) === null || _t === void 0 ? void 0 : _t.channelId,
            incomingWebhookConfigurationUrl: (_u = i.incomingWebhook) === null || _u === void 0 ? void 0 : _u.configurationUrl,
            isEnterpriseInstall: i.isEnterpriseInstall,
            tokenType: i.tokenType,
            installedAt: new Date(),
        };
        if (this.historicalDataEnabled) {
            await this.onStoreInstallation({
                prismaInput: entity,
                installation: i,
                logger: this.logger,
            });
            await this.prismaTable.create({ data: entity });
        }
        else {
            const where = this.buildFullWhereClause({
                enterpriseId,
                teamId,
                userId,
                isEnterpriseInstall,
            });
            const existingRow = await this.prismaTable.findFirst({
                where,
                select: { id: true },
            });
            await this.onStoreInstallation({
                prismaInput: entity,
                installation: i,
                logger: this.logger,
                query: where,
                idToUpdate: existingRow === null || existingRow === void 0 ? void 0 : existingRow.id,
            });
            if (existingRow) {
                await this.prismaTable.update({ data: entity, where: { id: existingRow.id } });
            }
            else {
                await this.prismaTable.create({ data: entity });
            }
        }
        logger === null || logger === void 0 ? void 0 : logger.debug(`#storeInstallation successfully completed ${commonLogPart}`);
    }
    // eslint-disable-next-line class-methods-use-this
    async fetchInstallation(query, logger) {
        var _a, _b;
        const { enterpriseId, teamId, userId } = query;
        const commonLogPart = `(enterprise_id: ${enterpriseId}, team_id: ${teamId}, user_id: ${userId})`;
        logger === null || logger === void 0 ? void 0 : logger.debug(`#fetchInstallation starts ${commonLogPart}`);
        let row = await this.prismaTable.findFirst({
            where: this.buildFullWhereClause(query),
            orderBy: [{ id: 'desc' }],
            take: 1,
        });
        if (query.userId !== undefined) {
            // Fetch the latest bot data in the table
            const botRow = await this.prismaTable.findFirst({
                where: this.buildBotQuery(query),
                orderBy: [{ id: 'desc' }],
                take: 1,
            });
            if (botRow && botRow.botId) {
                if (row) {
                    row.botId = botRow.botId;
                    row.botRefreshToken = botRow.botRefreshToken;
                    row.botScopes = botRow.botScopes;
                    row.botToken = botRow.botToken;
                    row.botTokenExpiresAt = botRow.botTokenExpiresAt;
                    row.botUserId = botRow.botUserId;
                }
                else {
                    row = botRow;
                }
            }
        }
        if (row !== null) {
            const userMatch = query.userId === row.userId;
            logger === null || logger === void 0 ? void 0 : logger.debug(`#fetchInstallation found the installation data ${commonLogPart}`);
            const installation = {
                team: row.teamId ?
                    {
                        id: row.teamId,
                        name: row.teamName || undefined,
                    } :
                    undefined,
                enterprise: row.enterpriseId ?
                    {
                        id: row.enterpriseId,
                        name: row.enterpriseName || undefined,
                    } :
                    undefined,
                enterpriseUrl: row.enterpriseUrl || undefined,
                user: userMatch ? {
                    // return an empty token if the userIDs don't match
                    id: row.userId,
                    token: row.userToken || undefined,
                    refreshToken: row.userRefreshToken || undefined,
                    expiresAt: row.userTokenExpiresAt ? Math.floor(row.userTokenExpiresAt.getTime() / 1000) : undefined,
                    scopes: (_a = row.userScopes) === null || _a === void 0 ? void 0 : _a.split(','),
                } : { id: "", token: "", scopes: [] },
                bot: row.botId && row.botUserId && row.botToken ?
                    {
                        id: row.botId,
                        userId: row.botUserId,
                        token: row.botToken,
                        refreshToken: row.botRefreshToken || undefined,
                        expiresAt: row.botTokenExpiresAt ? Math.floor(row.botTokenExpiresAt.getTime() / 1000) : undefined,
                        scopes: ((_b = row.botScopes) === null || _b === void 0 ? void 0 : _b.split(',')) || [],
                    } :
                    undefined,
                incomingWebhook: row.incomingWebhookUrl ?
                    {
                        url: row.incomingWebhookUrl,
                        channel: row.incomingWebhookChannel || undefined,
                        channelId: row.incomingWebhookChannelId || undefined,
                        configurationUrl: row.incomingWebhookConfigurationUrl || undefined,
                    } :
                    undefined,
                appId: row.appId || undefined,
                tokenType: 'bot',
                isEnterpriseInstall: row.isEnterpriseInstall,
                authVersion: 'v2', // This module does not support v1 installations
            };
            await this.onFetchInstallation({
                query,
                installation,
                logger: this.logger,
            });
            return installation;
        }
        logger === null || logger === void 0 ? void 0 : logger.debug(`#fetchInstallation didn't return any installation data. Passing nullInstallation ${commonLogPart}`);
        const nullInstallation = {
            user: {
                id: '',
                token: "",
                scopes: [],
            },
            team: { id: "" },
            enterprise: { id: "" }
        };
        return nullInstallation;
    }
    // eslint-disable-next-line class-methods-use-this
    async deleteInstallation(query, logger) {
        const { enterpriseId, teamId, userId } = query;
        const commonLogPart = `(enterprise_id: ${enterpriseId}, team_id: ${teamId}, user_id: ${userId})`;
        logger === null || logger === void 0 ? void 0 : logger.debug(`#deleteInstallation starts ${commonLogPart}`);
        await this.onDeleteInstallation({
            query,
            logger: this.logger,
        });
        const deleted = await this.prismaTable.deleteMany({
            where: this.buildFullWhereClause(query),
        });
        logger === null || logger === void 0 ? void 0 : logger.debug(`#deleteInstallation deleted ${deleted.count} rows ${commonLogPart}`);
    }
    // eslint-disable-next-line class-methods-use-this
    async close() {
        var _a;
        await ((_a = this.prismaClient) === null || _a === void 0 ? void 0 : _a.$disconnect());
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildBotQuery(query) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where = this.buildFullWhereClause(query);
        // No userId here
        delete where.userId;
        return where;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildFullWhereClause(query) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where = {};
        if (this.clientId !== undefined) {
            where.clientId = this.clientId;
        }
        else {
            where.clientId = null;
        }
        if (query.enterpriseId !== undefined) {
            where.enterpriseId = query.enterpriseId;
        }
        if (query.isEnterpriseInstall) {
            where.teamId = null;
        }
        else if (query.teamId !== undefined) {
            where.teamId = query.teamId;
        }
        if (query.userId !== undefined) {
            where.userId = query.userId;
        }
        return where;
    }
}
exports.default = PrismaInstallationStore;
//# sourceMappingURL=PrismaInstallationStore.js.map