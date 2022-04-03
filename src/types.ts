export type ErrorMessageType = {
    message: string;
    field: string;
}

export type PostType = {
    id: number;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
    bloggerName: string | null;
}

export type BloggerType = {
    id: number;
    name: string | null;
    youtubeUrl: string | null;
}
