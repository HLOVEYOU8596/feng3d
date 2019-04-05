interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    readonly size: number;
}
interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(entries?: [K, V][]): Map<K, V>;
    readonly prototype: Map<any, any>;
}
declare var Map: MapConstructor;
interface ReadonlyMap<K, V> {
    forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    readonly size: number;
}
interface WeakMap<K extends object, V> {
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
}
interface WeakMapConstructor {
    new (): WeakMap<object, any>;
    new <K extends object, V>(entries?: [K, V][]): WeakMap<K, V>;
    readonly prototype: WeakMap<object, any>;
}
declare var WeakMap: WeakMapConstructor;
interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}
interface SetConstructor {
    new (): Set<any>;
    new <T>(values?: T[]): Set<T>;
    readonly prototype: Set<any>;
}
declare var Set: SetConstructor;
interface ReadonlySet<T> {
    forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}
interface WeakSet<T> {
    add(value: T): this;
    delete(value: T): boolean;
    has(value: T): boolean;
}
interface WeakSetConstructor {
    new (): WeakSet<object>;
    new <T extends object>(values?: T[]): WeakSet<T>;
    readonly prototype: WeakSet<object>;
}
declare var WeakSet: WeakSetConstructor;
interface Map<K, V> {
    getKeys(): K[];
    getValues(): V[];
}
declare namespace feng3d {
    /**
     * 事件
     */
    var event: FEvent;
    /**
     * 只针对Object的事件
     */
    var objectevent: ObjectEventDispatcher<Object, ObjectEventType>;
    /**
     * Object 事件类型
     */
    interface ObjectEventType {
        /**
         * 属性值变化
         */
        propertyValueChanged: {
            property: string;
            oldValue: any;
            newValue: any;
        };
    }
    /**
     * 用于适配不同对象对于的事件
     */
    interface ObjectEventDispatcher<O, T> {
        once<K extends keyof T>(target: O, type: K, listener: (event: Event<T[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof T>(target: O, type: K, data?: T[K], bubbles?: boolean): Event<T[K]>;
        has<K extends keyof T>(target: O, type: K): boolean;
        on<K extends keyof T>(target: O, type: K, listener: (event: Event<T[K]>) => void, thisObject?: any, priority?: number, once?: boolean): void;
        off<K extends keyof T>(target: O, type?: K, listener?: (event: Event<T[K]>) => void, thisObject?: any): void;
    }
    /**
     * 事件
     */
    class FEvent {
        private feventMap;
        private getBubbleTargets;
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        once(obj: Object, type: string, listener: (event: any) => void, thisObject?: any, priority?: number): void;
        /**
         * 派发事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param e   事件对象
         * @returns 返回事件是否被该对象处理
         */
        dispatchEvent(obj: Object, e: Event<any>): boolean;
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 dispatchEvent() 方法的 IEvent 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        dispatch(obj: Object, type: string, data?: any, bubbles?: boolean): Event<any>;
        /**
         * 检查 Event 对象是否为特定事件类型注册了任何侦听器.
         *
         * @param type		事件的类型。
         * @return 			如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
         */
        has(obj: Object, type: string): boolean;
        /**
         * 添加监听
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        on(obj: Object, type: string, listener: (event: any) => any, thisObject?: any, priority?: number, once?: boolean): void;
        /**
         * 移除监听
         * @param dispatcher 派发器
         * @param type						事件的类型。
         * @param listener					要删除的侦听器对象。
         */
        off(obj: Object, type?: string, listener?: (event: any) => any, thisObject?: any): void;
        /**
         * 监听对象的所有事件
         * @param obj 被监听对象
         * @param listener 回调函数
         * @param thisObject 回调函数 this 指针
         * @param priority 优先级
         */
        onAll(obj: Object, listener: (event: any) => void, thisObject?: any, priority?: number): void;
        /**
         * 移除监听对象的所有事件
         * @param obj 被监听对象
         * @param listener 回调函数
         * @param thisObject 回调函数 this 指针
         */
        offAll(obj: Object, listener?: (event: any) => void, thisObject?: any): void;
        /**
         * 处理事件
         * @param e 事件
         */
        protected handleEvent(obj: Object, e: Event<any>): void;
        /**
         * 处理事件冒泡
         * @param e 事件
         */
        protected handelEventBubbles(obj: Object, e: Event<any>): void;
    }
    /**
     * 事件
     */
    interface Event<T> {
        /**
         * 事件的类型。类型区分大小写。
         */
        type: string;
        /**
         * 事件携带的自定义数据
         */
        data: T;
        /**
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        bubbles: boolean;
        /**
         * 事件目标。
         */
        target: any;
        /**
         * 当前正在使用某个事件侦听器处理 Event 对象的对象。
         */
        currentTarget: any;
        /**
         * 是否停止处理事件监听器
         */
        isStop: boolean;
        /**
         * 是否停止冒泡
         */
        isStopBubbles: boolean;
        /**
         * 事件流过的对象列表，事件路径
         */
        targets: any[];
        /**
         * 处理列表
         */
        handles: ListenerVO[];
    }
    /**
     * 监听数据
     */
    interface ListenerVO {
        /**
         * 监听函数
         */
        listener: (event: Event<any>) => void;
        /**
         * 监听函数作用域
         */
        thisObject: any;
        /**
         * 优先级
         */
        priority: number;
        /**
         * 是否只监听一次
         */
        once: boolean;
    }
}
declare namespace feng3d {
    /**
     * 全局事件
     */
    var dispatcher: IEventDispatcher<GlobalEvents>;
    interface GlobalEvents {
        /**
         * shader资源发生变化
         */
        "asset.shaderChanged": any;
        /**
         * 脚本发生变化
         */
        "asset.scriptChanged": any;
        /**
         * 图片资源发生变化
         */
        "asset.imageAssetChanged": {
            url: string;
        };
        /**
         * 解析出资源
         */
        "asset.parsed": any;
        /**
         * 删除文件
         */
        "fs.delete": string;
        /**
         * 写文件
         */
        "fs.write": string;
    }
    interface IEventDispatcher<T> {
        once<K extends keyof T>(type: K, listener: (event: Event<T[K]>) => void, thisObject?: any, priority?: number): void;
        dispatch<K extends keyof T>(type: K, data?: T[K], bubbles?: boolean): Event<T[K]>;
        has<K extends keyof T>(type: K): boolean;
        on<K extends keyof T>(type: K, listener: (event: Event<T[K]>) => void, thisObject?: any, priority?: number, once?: boolean): void;
        off<K extends keyof T>(type?: K, listener?: (event: Event<T[K]>) => void, thisObject?: any): void;
    }
    /**
     * 事件适配器
     */
    class EventDispatcher {
        /**
         * 监听一次事件后将会被移除
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param thisObject                listener函数作用域
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        once(type: string, listener: (event: any) => void, thisObject?: any, priority?: number): void;
        /**
         * 派发事件
         *
         * 当事件重复流向一个对象时将不会被处理。
         *
         * @param e   事件对象
         * @returns 返回事件是否被该对象处理
         */
        dispatchEvent(e: Event<any>): boolean;
        /**
         * 将事件调度到事件流中. 事件目标是对其调用 dispatchEvent() 方法的 IEvent 对象。
         * @param type                      事件的类型。类型区分大小写。
         * @param data                      事件携带的自定义数据。
         * @param bubbles                   表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         */
        dispatch(type: string, data?: any, bubbles?: boolean): Event<any>;
        /**
         * 检查 Event 对象是否为特定事件类型注册了任何侦听器.
         *
         * @param type		事件的类型。
         * @return 			如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
         */
        has(type: string): boolean;
        /**
         * 添加监听
         * @param type						事件的类型。
         * @param listener					处理事件的侦听器函数。
         * @param priority					事件侦听器的优先级。数字越大，优先级越高。默认优先级为 0。
         */
        on(type: string, listener: (event: any) => void, thisObject?: any, priority?: number, once?: boolean): void;
        /**
         * 移除监听
         * @param dispatcher 派发器
         * @param type						事件的类型。
         * @param listener					要删除的侦听器对象。
         */
        off(type?: string, listener?: (event: any) => void, thisObject?: any): void;
        /**
         * 监听对象的所有事件
         * @param obj 被监听对象
         * @param listener 回调函数
         * @param thisObject 回调函数 this 指针
         * @param priority 优先级
         */
        onAll(listener: (event: any) => void, thisObject?: any, priority?: number): void;
        /**
         * 移除监听对象的所有事件
         * @param obj 被监听对象
         * @param listener 回调函数
         * @param thisObject 回调函数 this 指针
         */
        offAll(listener?: (event: any) => void, thisObject?: any): void;
        /**
         * 处理事件
         * @param e 事件
         */
        protected handleEvent(e: Event<any>): void;
        /**
         * 处理事件冒泡
         * @param e 事件
         */
        protected handelEventBubbles(e: Event<any>): void;
    }
}
//# sourceMappingURL=event.d.ts.map