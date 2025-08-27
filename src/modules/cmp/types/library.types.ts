export type AssetLineage = {
    id: string;
    name: string;
    asset_id: string;
    version_id: string;
    used_in: string;
    uri: string;
    icon_url: string;
    rendition_id: string;
    created_at: string;
    links: {
      self: string;
      asset: string;
    };
  };
  
  export type Asset = {
    id: string;
    title: string;
    type: string;
    mime_type: string;
    file_extension: string;
    created_at: string;
    modified_at: string;
    folder_id: string;
    file_location: string;
    is_archived: boolean;
    content: {
      type: string;
      value: string;
    };
    labels: {
      group: {
        id: string;
        name: string;
      };
      values: {
        id: string;
        name: string;
      }[];
    }[];
    links: {
      self: string;
    };
    url: string;
    owner_organization_id: string;
    thumbnail_url: string;
    fileSize: number;
  };
  
  export type AssetField = {
    id: string;
    name: string;
    values: string[];
    type: string;
    choices: {
      id: string;
      name: string;
    }[];
  };
  
  export type AssetLabel = {
    group: {
      id: string;
      name: string;
    };
    values: {
      id: string;
      name: string;
    }[];
  };
  
  export type PaginatedData<D> = {
    data: D[];
    pagination: { next: string | null };
  };
  

  export const BynderLabel = 'Bynder';
  export type ThirdPartyNames = typeof BynderLabel;
