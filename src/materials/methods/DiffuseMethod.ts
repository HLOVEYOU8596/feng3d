module feng3d
{
	/**
	 * 漫反射函数
	 * @author feng 2017-03-22
	 */
    export class DiffuseMethod extends RenderDataHolder
    {
        /**
         * 漫反射纹理
         */
        public difuseTexture: Texture2D = new Texture2D();

        /**
         * 基本颜色
         */
        public color = new Color(1, 1, 1, 1);

        /**
         * 构建
         */
        constructor()
        {
            super();
            this.difuseTexture.addEventListener(Event.LOADED, this.invalidateRenderData, this);
            Watcher.watch(this, ["color"], this.invalidateRenderData, this);
        }

        /**
		 * 更新渲染数据
		 */
        public updateRenderData(renderContext: RenderContext, renderData: RenderAtomic)
        {
            renderData.uniforms[RenderDataID.u_diffuse] = this.color;

            if (this.difuseTexture.checkRenderData())
            {
                renderData.uniforms[RenderDataID.s_diffuse] = this.difuseTexture;
                renderData.shaderMacro.boolMacros.HAS_DIFFUSE_MAP = true;
            } else
            {
                renderData.uniforms[RenderDataID.s_diffuse] = null;
                renderData.shaderMacro.boolMacros.HAS_DIFFUSE_MAP = false;
            }

            //
            super.updateRenderData(renderContext, renderData);
        }
    }
}