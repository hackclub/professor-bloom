export type Template = {
    id: number;
    name: string;
    content: string;
};
export declare function getTemplate(name: string): Promise<Template>;
export declare function getAllTemplates(): Promise<Template[]>;
export declare function addTemplate(name: string, content: string): Promise<Template>;
export declare function editTemplate(name: string, content: string): Promise<void>;
export declare function deleteTemplate(name: string): Promise<void>;
