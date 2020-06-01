(function() {
    /**
     * @constructor
     */
    vox.TextureFactory = function() {};

    /**
     * @param {vox.VoxelData} voxelData
     * @return {HTMLCanvasElement}
     */
    vox.TextureFactory.prototype.createTextureData = function(voxelData) {
        var data = new Uint8Array( 3 * 256 );
        console.log('pl', voxelData.palette.length);
        for (var i = 0, len = voxelData.palette.length; i < len; i++) {
            var p = voxelData.palette[i];
            var stride = i * 3;

            data[ stride ] = p.r;
            data[ stride + 1 ] = p.g;
            data[ stride + 2 ] = p.b;
            if (i === 87) {
                console.log(stride);
                console.log(data[ stride ]);
            }
        }

        return data;
    };
    
    /**
     * パレット情報を元に作成したテクスチャを返す.
     * 生成されたテクスチャはキャッシュされ、同一のパレットからは同じテクスチャオブジェクトが返される.
     * @param {vox.VoxelData} voxelData
     * @return {THREE.Texture}
     */
    vox.TextureFactory.prototype.getTexture = function(voxelData) {
        var palette = voxelData.palette;
        var hashCode = getHashCode(palette);
        if (hashCode in cache) {
            // console.log("cache hit");
            return cache[hashCode];
        }
        
        var textureData = this.createTextureData(voxelData);
        var texture = new THREE.DataTexture(textureData, 256, 1, THREE.RGBFormat);
        texture.needsUpdate = true;
        
        cache[hashCode] = texture;
        
        return texture;
    };
    
    var cache = {};
    
    var getHashCode = function(palette) {
        var str = "";
        for (var i = 0; i < 256; i++) {
            var p = palette[i];
            str += hex(p.r);
            str += hex(p.g);
            str += hex(p.b);
            str += hex(p.a);
        }
        return vox.md5(str);
    };
    var hex = function(num) {
        var r = num.toString(16);
        return (r.length === 1) ? "0" + r : r;
    };

})();
