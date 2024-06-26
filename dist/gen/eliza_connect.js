"use strict";
// @generated by protoc-gen-connect-es v1.1.2 with parameter "target=ts"
// @generated from file eliza.proto (package connectrpc.eliza.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElizaService = void 0;
const protobuf_1 = require("@bufbuild/protobuf");
const eliza_pb_1 = require("./eliza_pb");
/**
 * @generated from service connectrpc.eliza.v1.ElizaService
 */
exports.ElizaService = {
    typeName: "connectrpc.eliza.v1.ElizaService",
    methods: {
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.SyncGithubItems
         */
        syncGithubItems: {
            name: "SyncGithubItems",
            I: eliza_pb_1.Empty,
            O: eliza_pb_1.Response,
            kind: protobuf_1.MethodKind.Unary,
        },
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.AssignActionItem
         */
        assignActionItem: {
            name: "AssignActionItem",
            I: eliza_pb_1.AssignRequest,
            O: eliza_pb_1.Response,
            kind: protobuf_1.MethodKind.Unary,
        },
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.ResolveActionItem
         */
        resolveActionItem: {
            name: "ResolveActionItem",
            I: eliza_pb_1.ActionItemRequest,
            O: eliza_pb_1.Response,
            kind: protobuf_1.MethodKind.Unary,
        },
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.IrrelevantActionItem
         */
        irrelevantActionItem: {
            name: "IrrelevantActionItem",
            I: eliza_pb_1.ActionItemRequest,
            O: eliza_pb_1.Response,
            kind: protobuf_1.MethodKind.Unary,
        },
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.UpdateNotes
         */
        updateNotes: {
            name: "UpdateNotes",
            I: eliza_pb_1.NoteRequest,
            O: eliza_pb_1.Response,
            kind: protobuf_1.MethodKind.Unary,
        },
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.SnoozeActionItem
         */
        snoozeActionItem: {
            name: "SnoozeActionItem",
            I: eliza_pb_1.DelayRequest,
            O: eliza_pb_1.Response,
            kind: protobuf_1.MethodKind.Unary,
        },
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.FollowUpActionItem
         */
        followUpActionItem: {
            name: "FollowUpActionItem",
            I: eliza_pb_1.DelayRequest,
            O: eliza_pb_1.Response,
            kind: protobuf_1.MethodKind.Unary,
        },
        /**
         * @generated from rpc connectrpc.eliza.v1.ElizaService.GetSlackActionItem
         */
        getSlackActionItem: {
            name: "GetSlackActionItem",
            I: eliza_pb_1.SlackActionItemRequest,
            O: eliza_pb_1.SlackActionItemResponse,
            kind: protobuf_1.MethodKind.Unary,
        },
    },
};
//# sourceMappingURL=eliza_connect.js.map