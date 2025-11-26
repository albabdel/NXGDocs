export type ContentType = "DOC_PAGE" | "API_ENDPOINT" | "FAQ" | "RELEASE_NOTE";

export const WEIGHTS: Record<ContentType, number> = {
    DOC_PAGE: 1.0,
    API_ENDPOINT: 1.2,
    FAQ: 1.1,
    RELEASE_NOTE: 0.8
};

export type SearchRecord = {
    id: string;
    url: string;
    type: ContentType;
    title: string;
    sectionTitle?: string;
    content: string; // Plain text snippet
    tags: string[];
    hierarchy: string[];
};
