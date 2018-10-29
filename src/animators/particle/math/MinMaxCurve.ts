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
    export class MinMaxCurve
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

        private _minMaxCurveConstant: MinMaxCurveConstant;
        private _curve: AnimationCurve;
        private _randomBetweenTwoConstants: RandomBetweenTwoConstants;
        private _randomBetweenTwoCurves: RandomBetweenTwoCurves;

        private _onModeChanged()
        {
            switch (this.mode)
            {
                case MinMaxCurveMode.Constant:
                    this.minMaxCurve = this._minMaxCurveConstant = this._minMaxCurveConstant || new MinMaxCurveConstant();
                    break;
                case MinMaxCurveMode.Curve:
                    this.minMaxCurve = this._curve = this._curve || new AnimationCurve();
                    break;
                case MinMaxCurveMode.RandomBetweenTwoConstants:
                    this.minMaxCurve = this._randomBetweenTwoConstants = this._randomBetweenTwoConstants || new RandomBetweenTwoConstants();
                    break;
                case MinMaxCurveMode.RandomBetweenTwoCurves:
                    this.minMaxCurve = this._randomBetweenTwoCurves = this._randomBetweenTwoCurves || new RandomBetweenTwoCurves();
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
            return v;
        }
    }
}