namespace feng3d
{
    export class JSFile extends StringFile
    {
        assetType = AssetExtension.js;

        textContent = "";
    }
    
    Feng3dAssets.assetTypeClassMap[AssetExtension.js] = JSFile;
}