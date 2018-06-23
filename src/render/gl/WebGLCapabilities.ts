namespace feng3d
{

    /**
     * WEBGL 功能
     */
    export class WebGLCapabilities
    {
        getMaxAnisotropy: () => any;
        getMaxPrecision: (precision: any) => "highp" | "mediump" | "lowp";
        precision: any;
        logarithmicDepthBuffer: boolean;
        maxTextures: any;
        maxVertexTextures: any;
        maxTextureSize: any;
        maxCubemapSize: any;
        maxAttributes: any;
        maxVertexUniforms: any;
        maxVaryings: any;
        maxFragmentUniforms: any;
        vertexTextures: boolean;
        floatFragmentTextures: boolean;
        floatVertexTextures: boolean;

        constructor(gl, extensions, parameters)
        {
            var maxAnisotropy;

            function getMaxAnisotropy()
            {

                if (maxAnisotropy !== undefined) return maxAnisotropy;

                var extension = extensions.get('EXT_texture_filter_anisotropic');

                if (extension !== null)
                {

                    maxAnisotropy = gl.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);

                } else
                {

                    maxAnisotropy = 0;

                }

                return maxAnisotropy;

            }

            function getMaxPrecision(precision)
            {

                if (precision === 'highp')
                {

                    if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
                        gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0)
                    {

                        return 'highp';

                    }

                    precision = 'mediump';

                }

                if (precision === 'mediump')
                {

                    if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
                        gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0)
                    {

                        return 'mediump';

                    }

                }

                return 'lowp';

            }

            var precision = parameters.precision !== undefined ? parameters.precision : 'highp';
            var maxPrecision = getMaxPrecision(precision);

            if (maxPrecision !== precision)
            {

                warn('THREE.WebGLRenderer:', precision, 'not supported, using', maxPrecision, 'instead.');
                precision = maxPrecision;

            }

            var logarithmicDepthBuffer = parameters.logarithmicDepthBuffer === true;

            var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            var maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            var maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

            var maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
            var maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
            var maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
            var maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

            var vertexTextures = maxVertexTextures > 0;
            var floatFragmentTextures = !!extensions.get('OES_texture_float');
            var floatVertexTextures = vertexTextures && floatFragmentTextures;

            this.getMaxAnisotropy = getMaxAnisotropy;
            this.getMaxPrecision = getMaxPrecision;

            this.precision = precision;
            this.logarithmicDepthBuffer = logarithmicDepthBuffer;

            this.maxTextures = maxTextures;
            this.maxVertexTextures = maxVertexTextures;
            this.maxTextureSize = maxTextureSize;
            this.maxCubemapSize = maxCubemapSize;

            this.maxAttributes = maxAttributes;
            this.maxVertexUniforms = maxVertexUniforms;
            this.maxVaryings = maxVaryings;
            this.maxFragmentUniforms = maxFragmentUniforms;

            this.vertexTextures = vertexTextures;
            this.floatFragmentTextures = floatFragmentTextures;
            this.floatVertexTextures = floatVertexTextures;

        }

    }

}