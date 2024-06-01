import { MethodKind } from "@bufbuild/protobuf";
import { ActionItemRequest, AssignRequest, DelayRequest, Empty, NoteRequest, Response, SlackActionItemRequest, SlackActionItemResponse } from "./eliza_pb";
/**
 * @generated from service connectrpc.eliza.v1.ElizaService
 */
export declare const ElizaService: {
    readonly typeName: "connectrpc.eliza.v1.ElizaService";
    readonly methods: {
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.SyncGithubItems
         */
        readonly syncGithubItems: {
            readonly name: "SyncGithubItems";
            readonly I: typeof Empty;
            readonly O: typeof Response;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.AssignActionItem
         */
        readonly assignActionItem: {
            readonly name: "AssignActionItem";
            readonly I: typeof AssignRequest;
            readonly O: typeof Response;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.ResolveActionItem
         */
        readonly resolveActionItem: {
            readonly name: "ResolveActionItem";
            readonly I: typeof ActionItemRequest;
            readonly O: typeof Response;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.IrrelevantActionItem
         */
        readonly irrelevantActionItem: {
            readonly name: "IrrelevantActionItem";
            readonly I: typeof ActionItemRequest;
            readonly O: typeof Response;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.UpdateNotes
         */
        readonly updateNotes: {
            readonly name: "UpdateNotes";
            readonly I: typeof NoteRequest;
            readonly O: typeof Response;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.SnoozeActionItem
         */
        readonly snoozeActionItem: {
            readonly name: "SnoozeActionItem";
            readonly I: typeof DelayRequest;
            readonly O: typeof Response;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.FollowUpActionItem
         */
        readonly followUpActionItem: {
            readonly name: "FollowUpActionItem";
            readonly I: typeof DelayRequest;
            readonly O: typeof Response;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.GetSlackActionItem
         */
        readonly getSlackActionItem: {
            readonly name: "GetSlackActionItem";
            readonly I: typeof SlackActionItemRequest;
            readonly O: typeof SlackActionItemResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
