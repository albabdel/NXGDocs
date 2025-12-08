export type ContentType = "DOC" | "API" | "BLOG" | "GUIDE";

export const WEIGHTS: Record<ContentType, number> = {
    DOC: 1.0,
    API: 1.2,
    BLOG: 0.9,
    GUIDE: 1.1
};

export type SearchRecord = {
    id: string;
    url: string;
    type: ContentType;
    title: string;
    sectionTitle?: string;
    content: string;
    tags: string[];
    hierarchy: string[];
    weight?: number;
};
