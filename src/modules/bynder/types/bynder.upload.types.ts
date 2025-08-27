export type S3MultipartParams = {
    acl: string;
    success_action_status: string;
    'Content-Type': string;
    key: string;
    Policy: string;
    'X-Amz-Signature': string;
    'x-amz-credential': string;
    'x-amz-algorithm': string;
    'x-amz-date': string;
};

export type S3File = {
    uploadid: string;
    targetid: string;
};

export type UploadInitResponse = {
    s3file: S3File;
    s3_filename: string;
    target_key: string;
    multipart_params: S3MultipartParams;
};

export type XMLResponse = {
    PostResponse: {
        Location: string;
        Bucket: string;
        Key: string;
        ETag: string;
    };
};

export type BynderFinalizeUploadResponse = {
    locationType: string; // Type of location, e.g., "s3"
    originalFilename: string; // Name of the original file
    filename: string; // Full path to the file
    output: string; // Output directory
    batchId: string; // Unique identifier for the batch
    success: boolean; // Indicates if the upload was successful
    importId: string; // Unique identifier for the import operation
    file: {
        bucket: string; // Name of the S3 bucket
        path: string; // Path to the file in the bucket
        type: string; // Type of file location, e.g., "s3"
    };
    sendRequest: boolean; // Indicates if a request should be sent
};
export type PollUploadResponse = {
    itemsFailed: string[]; // List of IDs for items that failed
    itemsRejected: string[]; // List of IDs for items that were rejected
    itemsDone: string[]; // List of IDs for items that were successfully completed
};

export type CompletedAssetSaveRes = {
    accessRequestId: string;
    mediaid: string;
    batchId: string;
    success: boolean;
    originalFileS3location: {
        bucket: string;
        path: string;
        region: string;
    };
    mediaitems: {
        original: string;
        destination: string;
    }[];
};

export type BynderHardCodedMetaProperty = {
    [key: `metaproperty.${string}`]: string;
};
