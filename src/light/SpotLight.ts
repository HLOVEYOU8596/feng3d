namespace feng3d
{

    export interface ComponentMap { SpotLight: SpotLight; }

    /**
     * 聚光灯光源
     */
    export class SpotLight extends Light
    {
        lightType = LightType.Spot;

        /**
         * 光照范围
         */
        @oav()
        @serialize
        get range()
        {
            return this._range;
        }
        set range(v)
        {
            if (this._range == v) return;
            this._range = v;
            this.invalidRange();
        }
        private _range = 10;

        /**
         * 
         */
        @oav()
        @serialize
        get angle()
        {
            return this._angle;
        }
        set angle(v)
        {
            if (this._angle == v) return;
            this._angle = v;
            this.invalidAngle();
        }
        private _angle = 60;

        /**
         * 半影.
         */
        @oav()
        @serialize
        penumbra = 0;

        /**
         * 椎体cos值
         */
        get coneCos()
        {
            return Math.cos(this.angle * 0.5 * Math.DEG2RAD);
        }

        get penumbraCos()
        {
            return Math.cos(this.angle * 0.5 * Math.DEG2RAD * (1 - this.penumbra));
        }

        private perspectiveLens: PerspectiveLens;

        constructor()
        {
            super();
            this.perspectiveLens = this.shadowCamera.lens = new PerspectiveLens(this.angle, 1, 0.1, this.range);
        }

        private invalidRange()
        {
            if (this.shadowCamera)
                this.shadowCamera.lens.far = this.range;
        }

        private invalidAngle()
        {
            if (this.perspectiveLens)
                this.perspectiveLens.fov = this.angle;
        }
    }
}