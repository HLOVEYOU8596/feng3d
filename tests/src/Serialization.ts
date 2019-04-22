namespace feng3d
{
    export class ObjectBase
    {
        @serialize
        id = 1;
    }

    export class C extends ObjectBase
    {
        // @serialize
        // id = 2;

        @serialize
        a = 1;

        @serialize
        c = 1;

        change()
        {
            console.log("change", this.a, arguments);
        }
    }

    QUnit.module("Serialization", () =>
    {
        QUnit.test("serialize function 序列化函数", (assert) =>
        {
            function add(a: number, b: number)
            {
                return a + b;
            }
            var result = serialization.serialize(add);
            var result1 = serialization.deserialize(result);

            var a = Math.random();
            var b = Math.random();
            assert.ok(result1 != add);
            assert.ok(result1(a, b) == add(a, b));
        });

        QUnit.test("serialize BaseType 序列化基础类型", (assert) =>
        {
            var arr = [1, "abc", true, null, undefined];

            arr.forEach(v =>
            {
                var v0 = serialization.serialize(v);
                assert.ok(v0 == v);
            });
        });

        QUnit.test("serialize serializable 序列化带serializable属性对象", (assert) =>
        {
            var obj = { serializable: false, a: 1 };
            var r = serialization.serialize(obj);
            assert.ok(r == undefined);

            obj.serializable = true;
            var r = serialization.serialize(obj);
            assert.ok(r.a == obj.a);

            delete obj.serializable;
            var r = serialization.serialize(obj);
            assert.ok(r.a == obj.a);
        });

        QUnit.test("serialize Feng3dObject 序列化Feng3dObject对象", (assert) =>
        {
            var obj = new Feng3dObject();
            obj.hideFlags = HideFlags.DontSave;
            var r = serialization.serialize(obj);
            assert.ok(r == undefined);

            obj.hideFlags = HideFlags.None;
            var r = serialization.serialize(obj);
            assert.ok(r != undefined);
        });

        QUnit.test("serialize 序列化拥有自定义serialize函数的对象", (assert) =>
        {
            var obj = {
                a: 1,
                serialize(obj)
                {
                    obj.a = this.a * 2;
                },
            };
            var r = serialization.serialize(obj);
            assert.ok(r.a == obj.a * 2);

            delete obj.serialize;
            var r = serialization.serialize(obj);
            assert.ok(r.a == 1);
        });

        QUnit.test("serialize Array", (assert) =>
        {
            var arr = [1, 2, 3, "a", "b"];

            var result = serialization.serialize(arr);
            var result1 = serialization.deserialize(result);

            var r = arr.reduce((prev, item, index) => { if (!prev) return prev; return arr[index] == result1[index]; }, true);

            assert.ok(r);
        });

        QUnit.test("serialize Object", (assert) =>
        {
            var obj = { a: 1, b: 2, c: 3, d: "a", e: "b" };

            var result = serialization.serialize(obj);
            var result1 = serialization.deserialize(result);

            var r = Object.keys(obj).reduce((prev, item) => { if (!prev) return prev; return obj[item] == result1[item]; }, true);

            assert.ok(r);
        });

        QUnit.test("serialize 自定义对象", (assert) =>
        {
            var base = new ObjectBase();
            base.id = Math.random();
            var resultb = serialization.serialize(base);
            var base1: ObjectBase = serialization.deserialize(resultb);
            assert.ok(base.id == base1.id);

            var c = new C();
            c.id = Math.random();
            c.a = Math.random();
            c.c = Math.random();
            var result = serialization.serialize(c);
            var c1: C = serialization.deserialize(result);
            assert.ok(c.id == c1.id);
            assert.ok(c.a == c1.a);
            assert.ok(c.c == c1.c);
        });

        QUnit.test("serialize.different 获取两个数据的差异", (assert) =>
        {
            var c = new C();
            c.id = 8;

            var diff = serialization.different(c, new C());
            assert.ok(Object.keys(diff).length == 1);
        });
    });
}