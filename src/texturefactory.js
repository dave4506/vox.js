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
        var data = new Uint8Array( 4 * 256 );

        for (var i = 0, len = voxelData.palette.length; i < len; i++) {
            var p = voxelData.palette[i];
            var stride = i * 4;

            data[ stride ] = p.r;
            data[ stride + 1 ] = p.g;
            data[ stride + 2 ] = p.b;
            data[ stride + 3 ] = p.a;
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
        var texture = new THREE.DataTexture(textureData, 256, 1, THREE.RGBAFormat);
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
