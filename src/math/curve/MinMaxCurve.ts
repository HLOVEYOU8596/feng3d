namespace feng3d
{
    export interface IMinMaxCurve
    {
        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number): number;
    }

    /**
     * 最大最小曲线
     */
    export class MinMaxCurve implements IMinMaxCurve 
    {
        /**
         * 模式
         */
        @serialize
        @watch("_onModeChanged")
        mode = MinMaxCurveMode.Constant;

        /**
         * 曲线
         */
        @serialize
        minMaxCurve: IMinMaxCurve = new MinMaxCurveConstant();

        /**
         * 曲线缩放比
         */
        @serialize
        curveMultiplier = 1;

        /**
         * 是否只取 0-1 ，例如 lifetime 为非负，需要设置为true
         */
        between0And1 = false;

        private _minMaxCurveConstant: MinMaxCurveConstant;
        private _curve: AnimationCurve;
        private _randomBetweenTwoConstants: MinMaxCurveRandomBetweenTwoConstants;
        private _randomBetweenTwoCurves: MinMaxCurveRandomBetweenTwoCurves;

        private _onModeChanged()
        {
            switch (this.mode)
            {
                case MinMaxCurveMode.Constant:
                    this.minMaxCurve = this._minMaxCurveConstant = this._minMaxCurveConstant || new MinMaxCurveConstant();
                    break;
                case MinMaxCurveMode.Curve:
                    if (this.minMaxCurve instanceof MinMaxCurveConstant) this.curveMultiplier = this.minMaxCurve.value;
                    this.minMaxCurve = this._curve = this._curve || Object.setValue(new AnimationCurve(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] });
                    break;
                case MinMaxCurveMode.RandomBetweenTwoConstants:
                    this.minMaxCurve = this._randomBetweenTwoConstants = this._randomBetweenTwoConstants || new MinMaxCurveRandomBetweenTwoConstants();
                    break;
                case MinMaxCurveMode.RandomBetweenTwoCurves:
                    if (this.minMaxCurve instanceof MinMaxCurveConstant) this.curveMultiplier = this.minMaxCurve.value;
                    this.minMaxCurve = this._randomBetweenTwoCurves = this._randomBetweenTwoCurves || new MinMaxCurveRandomBetweenTwoCurves();
                    break;
            }
        }

        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number)
        {
            var v = this.minMaxCurve.getValue(time);
            if (this.mode == MinMaxCurveMode.Curve || this.mode == MinMaxCurveMode.RandomBetweenTwoCurves) v = this.curveMultiplier * v;
            return v;
        }
    }
}