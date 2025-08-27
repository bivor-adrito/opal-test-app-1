export type BynderAssetUpdateData = {
    name?: string;
    description?: string;
    copyright?: string;
    brandId?: string;
    tags?: string;
    [key: string]: string | boolean | undefined; // Allowing dynamic keys with string/boolean values
    datePublished?: string;
    archive?: boolean;
    archiveDate?: string;
    limited?: boolean;
    limitedDate?: string;
    watermarkDate?: string;
    isPublic?: boolean; // Indicating the public state of the asset. Warning irreversible, once changed to true it cannot be changed back.
};


