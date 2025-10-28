export interface Article {
    _id?: string;
    title: string;
    summary: string;
    content_url: string;
    publicationDate: Date;
    illustration_url: string;
    authors: string[];
    labels: string[];
    createdAt?: Date;
    updatedAt?: Date;
    };
    
