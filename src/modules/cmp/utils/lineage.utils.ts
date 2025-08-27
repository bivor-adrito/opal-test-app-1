import { ThirdPartyNames } from '@modules/cmp/types/library.types';

const icons = {
    Bynder: 'https://www.bynder.com/favicon.ico',
};

/**
 * Generates lineage create POST Method payload
 * @param externalUri External URI for the lineage
 * @param name Third party name, example - Sharepoint
 * @returns Create lineage request body payload
 */
export const generateAddLineagePayload = (externalUri: string, name: ThirdPartyNames) => ({
    name,
    uri: externalUri,
    icon_url: icons[name],
});

/**
 * Extracts asset id from lineage url
 * @param lineageUrl Lineage url containing the asset id
 * @returns asset id string or undefined if not found
 */
export function getAssetIdFromLineageUrl(lineageUrl: string) {
    const idPattern = /sidebar:([^/]+)\/properties/;
    return lineageUrl.match(idPattern)?.at(1);
}
