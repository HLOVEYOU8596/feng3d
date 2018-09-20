namespace feng3d
{
    export interface UniformsMap { }
    export type ShaderNames = keyof UniformsMap;
    export type UniformsData = UniformsMap[keyof UniformsMap];

    /**
     * 材质
     */
    export class Material extends Feng3dAssets
    {
        __class__: "feng3d.Material" = "feng3d.Material";

        type = AssetExtension.material;

        /**
         * shader名称
         */
        @oav({ component: "OAVMaterialName" })
        @serialize
        @watch("onShaderChanged")
        shaderName: ShaderNames = "standard";

        /**
         * Uniform数据
         */
        @serialize
        @oav({ component: "OAVObjectView" })
        uniforms: UniformsData = new StandardUniforms();

        /**
         * 渲染参数
         */
        @serialize
        @oav({ block: "渲染参数", component: "OAVObjectView" })
        renderParams = new RenderParams();

        constructor()
        {
            super();
            feng3dDispatcher.on("assets.shaderChanged", this.onShaderChanged, this);
        }

        beforeRender(renderAtomic: RenderAtomic)
        {
            for (const key in this.uniforms)
            {
                if (this.uniforms.hasOwnProperty(key))
                {
                    renderAtomic.uniforms[<any>key] = this.uniforms[key];
                }
            }
            renderAtomic.shader = this._shader;
            renderAtomic.renderParams = this.renderParams;

            renderAtomic.shaderMacro.IS_POINTS_MODE = this.renderParams.renderMode == RenderMode.POINTS;
        }

        /**
         * 渲染程序
         */
        private _shader: Shader;

        private onShaderChanged()
        {
            var cls = shaderConfig.shaders[this.shaderName].cls;
            cls = cls || StandardUniforms;
            if (cls)
            {
                if (!(this.uniforms instanceof cls))
                {
                    var newuniforms = new cls();
                    serialization.setValue(newuniforms, <any>this.uniforms);
                    this.uniforms = newuniforms;
                }
            }
            this._shader = new Shader(this.shaderName);
        }

        /**
         * 默认材质
         */
        static get default()
        {
            return Material._default = Material._default || new Material().value({ name: "Default-Material", hideFlags: HideFlags.NotEditable });
        }
        private static _default: Material;
    }
}
