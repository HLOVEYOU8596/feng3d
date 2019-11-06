namespace feng3d
{

	/**
	 * 粒子
	 */
	export class Particle
	{
		/**
		 * 出生时间
		 */
		birthTime = 0;

		/**
		 * 寿命
		 */
		lifetime = 5;

		/**
		 * 位置
		 */
		position = new Vector3();

		/**
		 * 速度
		 */
		velocity = new Vector3();

		/**
		 * 旋转角度
		 */
		rotation = new Vector3();

		/**
		 * 尺寸
		 */
		size = new Vector3(1, 1, 1);

		/**
		 * 起始尺寸
		 */
		startSize = new Vector3(1, 1, 1);

		/**
		 * 颜色
		 */
		color = new Color4();

		/**
		 * 起始颜色
		 */
		startColor = new Color4();

		/**
		 * 出生时在周期的位置（临时数据）
		 */
		birthRateAtDuration: number;

		/**
		 * 更新状态
		 */
		updateState(preTime: number, time: number)
		{
			preTime = Math.max(preTime, this.birthTime);
			time = Math.max(this.birthTime, time);

			var pTime = time - preTime;

			// 计算位置
			this.position.x += this.velocity.x * pTime;
			this.position.y += this.velocity.y * pTime;
			this.position.z += this.velocity.z * pTime;
		}
	}
}
