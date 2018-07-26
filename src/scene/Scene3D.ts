namespace feng3d
{
    /**
	 * 组件事件
	 */
    export interface GameObjectEventMap
    {
        addToScene: GameObject;
        removeFromScene: GameObject;
        addComponentToScene: Component;
        removeComponentFromScene: Component;
    }

    /**
     * 3D场景
     * @author feng 2016-05-01
     */
    export class Scene3D extends Component
    {
        /**
         * 背景颜色
         */
        @serialize
        @oav()
        background = new Color4(0, 0, 0, 1);
        /**
         * 环境光强度
         */
        @serialize
        @oav()
        ambientColor = new Color4();

        /**
         * 指定更新脚本标记，用于过滤需要调用update的脚本
         */
        updateScriptFlag = ScriptFlag.feng3d;

        /**
         * 收集组件
         */
        collectComponents: {
            cameras: {
                cls: typeof Camera;
                list: Camera[];
            };
            pointLights: {
                cls: typeof PointLight;
                list: PointLight[];
            };
            directionalLights: {
                cls: typeof DirectionalLight;
                list: DirectionalLight[];
            };
            skyboxs: {
                cls: typeof SkyBox;
                list: SkyBox[];
            };
            animations: {
                cls: typeof Animation;
                list: Animation[];
            };
            scripts: {
                cls: typeof ScriptComponent;
                list: ScriptComponent[];
            };
            behaviours: {
                cls: typeof Behaviour;
                list: Behaviour[];
            };
        };

        private _mouseCheckObjects: { layer: number, objects: GameObject[] }[];
        private _meshRenderers: MeshRenderer[];
        private _visibleAndEnabledMeshRenderers: MeshRenderer[];
        private _skyBoxs: SkyBox[];
        private _activeSkyBoxs: SkyBox[];

        /**
         * 构造3D场景
         */
        init(gameObject: GameObject)
        {
            super.init(gameObject);
            gameObject["_scene"] = this;
            this.transform.showInInspector = false;

            ticker.onframe(this.onEnterFrame, this)

            this.initCollectComponents();
        }

        dispose()
        {
            ticker.offframe(this.onEnterFrame, this)
            super.dispose();
        }

        initCollectComponents()
        {
            this.collectComponents = {
                cameras: { cls: Camera, list: new Array<Camera>() },
                pointLights: { cls: PointLight, list: new Array<PointLight>() },
                directionalLights: { cls: DirectionalLight, list: new Array<DirectionalLight>() },
                skyboxs: { cls: SkyBox, list: new Array<SkyBox>() },
                animations: { cls: Animation, list: new Array<Animation>() },
                behaviours: { cls: Behaviour, list: new Array<Behaviour>() },
                scripts: { cls: ScriptComponent, list: new Array<ScriptComponent>() },
            };
            var _this = this;
            collect(this.gameObject);

            function collect(gameobject: GameObject)
            {
                gameobject["_scene"] = _this;
                _this._addGameObject(gameobject);

                gameobject.children.forEach(element =>
                {
                    collect(element);
                });
            }
        }

        private onEnterFrame(interval: number)
        {
            // 每帧清理拾取缓存
            this.pickMap.forEach(item => item.clear());

            this.collectComponents.animations.list.forEach(element =>
            {
                if (element.isplaying)
                    element.update(interval);
            });
            this.collectComponents.behaviours.list.forEach(element =>
            {
                if (element.isVisibleAndEnabled && (this.updateScriptFlag & element.flag))
                    element.update(interval);
            });
        }

        update()
        {
            this._mouseCheckObjects = <any>null;
            this._meshRenderers = null;
            this._visibleAndEnabledMeshRenderers = null;
            this._skyBoxs = null;
            this._activeSkyBoxs = null;
        }

        /**
         * 所有MeshRenderer
         */
        get meshRenderers()
        {
            if (!this._meshRenderers)
            {
                this._meshRenderers = this.getComponentsInChildren(MeshRenderer);
            }
            return this._meshRenderers;
        }

        /**
         * 所有 可见且开启的 MeshRenderer
         */
        get visibleAndEnabledMeshRenderers()
        {
            if (!this._visibleAndEnabledMeshRenderers)
            {
                this._visibleAndEnabledMeshRenderers = this.meshRenderers.filter(i => i.isVisibleAndEnabled)
            }
            return this._visibleAndEnabledMeshRenderers;
        }

        /**
         * 所有 SkyBox
         */
        get skyBoxs()
        {
            if (!this._skyBoxs)
            {
                this._skyBoxs = this.getComponentsInChildren(SkyBox);
            }
            return this._skyBoxs;
        }

        get activeSkyBoxs()
        {
            if (!this._activeSkyBoxs)
            {
                this._activeSkyBoxs = this.skyBoxs.filter(i => i.gameObject.globalVisible);
            }
            return this._activeSkyBoxs;
        }

        get mouseCheckObjects()
        {
            if (this._mouseCheckObjects)
                return this._mouseCheckObjects;

            var checkList = this.gameObject.getChildren();
            var layers: { [mouselayer: number]: GameObject[] } = {};
            var i = 0;
            //获取所有需要拾取的对象并分层存储
            while (i < checkList.length)
            {
                var checkObject = checkList[i++];
                if (checkObject.mouseEnabled)
                {
                    if (checkObject.getComponents(MeshRenderer))
                    {
                        var mouselayer = ~~checkObject.mouselayer;
                        layers[mouselayer] = layers[mouselayer] || [];
                        layers[mouselayer].push(checkObject);
                    }
                    checkList = checkList.concat(checkObject.getChildren());
                }
            }
            //获取分层数组
            this._mouseCheckObjects = [];
            var results = this._mouseCheckObjects;
            for (var layer in layers)
            {
                if (layers.hasOwnProperty(layer))
                {
                    results.push({ layer: ~~layer, objects: layers[layer] });
                }
            }
            //按层级排序
            results = results.sort((a, b) => { return b.layer - a.layer; });
            return results;
        }

        _addGameObject(gameobject: GameObject)
        {
            gameobject.components.forEach(element =>
            {
                this._addComponent(element);
            });
            this.dispatch("addToScene", gameobject);
        }

        _removeGameObject(gameobject: GameObject)
        {
            gameobject.components.forEach(element =>
            {
                this._removeComponent(element);
            });

            this.dispatch("removeFromScene", gameobject);
        }

        _addComponent(component: Component)
        {
            var collectComponents = this.collectComponents;
            for (var key in collectComponents)
            {
                if (collectComponents.hasOwnProperty(key))
                {
                    var element: {
                        cls: typeof Component;
                        list: Component[];
                    } = collectComponents[key];
                    if (component instanceof element.cls)
                    {
                        element.list.push(component);
                    }
                }
            }
            this.dispatch("addComponentToScene", component);
        }

        _removeComponent(component: Component)
        {
            var collectComponents = this.collectComponents;
            for (var key in collectComponents)
            {
                if (collectComponents.hasOwnProperty(key))
                {
                    var element: {
                        cls: typeof Component;
                        list: Component[];
                    } = collectComponents[key];
                    if (component instanceof element.cls)
                    {
                        var index = element.list.indexOf(component);
                        if (index != -1)
                            element.list.splice(index, 1);
                    }
                }
            }
            this.dispatch("removeComponentFromScene", component);
        }

        /**
         * 获取天空盒
         */
        getActiveSkyBox()
        {
            var skyboxs = this.collectComponents.skyboxs.list.filter((skybox) =>
            {
                return skybox.gameObject.globalVisible;
            });
            return skyboxs[0];
        }

        private pickMap = new Map<Camera, ScenePickCache>();
        /**
         * 获取拾取缓存
         * @param camera 
         */
        getPickCache(camera: Camera)
        {
            if (this.pickMap.get(camera))
                return this.pickMap.get(camera);
            var pick = new ScenePickCache(this, camera);
            this.pickMap.set(camera, pick);
            return pick;
        }

        /**
         * 获取接收光照渲染对象列表
         * @param light 
         */
        getPickByDirectionalLight(light: DirectionalLight)
        {
            var openlist = [this.gameObject];
            var targets: MeshRenderer[] = [];
            while (openlist.length > 0)
            {
                var item = openlist.shift();
                if (!item.visible) continue;
                var meshRenderer = item.getComponent(MeshRenderer);
                if (meshRenderer && (meshRenderer.castShadows || meshRenderer.receiveShadows)
                    && !meshRenderer.material.renderParams.enableBlend
                    && meshRenderer.material.renderParams.renderMode == RenderMode.TRIANGLES
                )
                {
                    targets.push(meshRenderer);
                }
                item.children.forEach(element =>
                {
                    openlist.push(element);
                });
            }
            return targets;
        }

        /**
         * 获取 可被摄像机看见的 MeshRenderer列表
         * @param camera 
         */
        getMeshRenderersByCamera(camera: Camera)
        {
            var results = this.visibleAndEnabledMeshRenderers.filter(i =>
            {
                var boundingComponent = i.getComponent(Bounding);
                if (boundingComponent.selfWorldBounds)
                {
                    if (camera.frustum.intersectsBox(boundingComponent.selfWorldBounds))
                        return true;
                }
                return false;
            });
            return results;
        }
    }
}