import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
/**
 * @generated from message connectrpc.eliza.v1.SyncRequest
 */
export declare class SyncRequest extends Message<SyncRequest> {
    /**
     * @generated from field: string project = 1;
     */
    project: string;
    constructor(data?: PartialMessage<SyncRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.SyncRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SyncRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SyncRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SyncRequest;
    static equals(a: SyncRequest | PlainMessage<SyncRequest> | undefined, b: SyncRequest | PlainMessage<SyncRequest> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.Empty
 */
export declare class Empty extends Message<Empty> {
    constructor(data?: PartialMessage<Empty>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.Empty";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Empty;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Empty;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Empty;
    static equals(a: Empty | PlainMessage<Empty> | undefined, b: Empty | PlainMessage<Empty> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.Response
 */
export declare class Response extends Message<Response> {
    /**
     * @generated from field: string response = 1;
     */
    response: string;
    constructor(data?: PartialMessage<Response>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.Response";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Response;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Response;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Response;
    static equals(a: Response | PlainMessage<Response> | undefined, b: Response | PlainMessage<Response> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.AssignRequest
 */
export declare class AssignRequest extends Message<AssignRequest> {
    /**
     * @generated from field: string actionId = 1;
     */
    actionId: string;
    /**
     * @generated from field: string userId = 2;
     */
    userId: string;
    constructor(data?: PartialMessage<AssignRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.AssignRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssignRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssignRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssignRequest;
    static equals(a: AssignRequest | PlainMessage<AssignRequest> | undefined, b: AssignRequest | PlainMessage<AssignRequest> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.ActionItemRequest
 */
export declare class ActionItemRequest extends Message<ActionItemRequest> {
    /**
     * @generated from field: string actionId = 1;
     */
    actionId: string;
    /**
     * @generated from field: optional string reason = 2;
     */
    reason?: string;
    constructor(data?: PartialMessage<ActionItemRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.ActionItemRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ActionItemRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ActionItemRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ActionItemRequest;
    static equals(a: ActionItemRequest | PlainMessage<ActionItemRequest> | undefined, b: ActionItemRequest | PlainMessage<ActionItemRequest> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.SlackActionItemRequest
 */
export declare class SlackActionItemRequest extends Message<SlackActionItemRequest> {
    /**
     * @generated from field: string slackId = 1;
     */
    slackId: string;
    constructor(data?: PartialMessage<SlackActionItemRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.SlackActionItemRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SlackActionItemRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SlackActionItemRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SlackActionItemRequest;
    static equals(a: SlackActionItemRequest | PlainMessage<SlackActionItemRequest> | undefined, b: SlackActionItemRequest | PlainMessage<SlackActionItemRequest> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.SlackActionItemResponse
 */
export declare class SlackActionItemResponse extends Message<SlackActionItemResponse> {
    /**
     * @generated from field: string actionId = 1;
     */
    actionId: string;
    constructor(data?: PartialMessage<SlackActionItemResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.SlackActionItemResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SlackActionItemResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SlackActionItemResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SlackActionItemResponse;
    static equals(a: SlackActionItemResponse | PlainMessage<SlackActionItemResponse> | undefined, b: SlackActionItemResponse | PlainMessage<SlackActionItemResponse> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.NoteRequest
 */
export declare class NoteRequest extends Message<NoteRequest> {
    /**
     * @generated from field: string actionId = 1;
     */
    actionId: string;
    /**
     * @generated from field: string note = 2;
     */
    note: string;
    constructor(data?: PartialMessage<NoteRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.NoteRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): NoteRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): NoteRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): NoteRequest;
    static equals(a: NoteRequest | PlainMessage<NoteRequest> | undefined, b: NoteRequest | PlainMessage<NoteRequest> | undefined): boolean;
}
/**
 * @generated from message connectrpc.eliza.v1.DelayRequest
 */
export declare class DelayRequest extends Message<DelayRequest> {
    /**
     * @generated from field: string actionId = 1;
     */
    actionId: string;
    /**
     * @generated from field: string userId = 2;
     */
    userId: string;
    /**
     * @generated from field: string datetime = 3;
     */
    datetime: string;
    /**
     * @generated from field: string reason = 4;
     */
    reason: string;
    constructor(data?: PartialMessage<DelayRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "connectrpc.eliza.v1.DelayRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DelayRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DelayRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DelayRequest;
    static equals(a: DelayRequest | PlainMessage<DelayRequest> | undefined, b: DelayRequest | PlainMessage<DelayRequest> | undefined): boolean;
}
