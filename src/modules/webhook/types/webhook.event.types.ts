export interface WebhookAsset {
    //todo: Rename to asset_event
    id: string;
    owner_organization_id: string;
    type: string;
    source: {
        id: string;
        type: string;
        links: {
            self: string;
        };
    };
    links: {
        self: string;
    };
}

export interface EventData {
    event_name: string;
    data: {
        asset: WebhookAsset;
        attributes_changed: string[];
    };
}

export interface EventHandler {
    handle(data: any): Promise<void>;
}
