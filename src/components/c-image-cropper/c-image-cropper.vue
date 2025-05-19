
<template>
    <view class="image-cropper" @touchmove.stop='preventTouchMove'>
        111
        <view class="main" @tap="_click">
            <view class="content">
                <view class="content_top bg_gray" :class="{ 'bg_black': !flag_bright }"
                    :style="{ height: `${cut_top}px`, transitionProperty: cut_animation ? '' : 'background' }">
                </view>
                <view class="content_middle" :style="{ height: `${height}px` }">
                    <view class="content_middle_left bg_gray" :class="{ 'bg_black': !flag_bright }"
                        :style="{ width: `${cut_left}px`, transitionProperty: cut_animation ? '' : 'background' }">
                    </view>
                    <view class="content_middle_middle" :style="{
                        width: `${width}px`, height: `${height}px`, transitionDuration: '.3s',
                        transitionProperty: cut_animation ? '' : 'background',
                    }">
                        <view @touchmove="onMove" @touchstart="onStart" class="corner-cont"
                            :style="{ width: `${width - 60}px`, height: `${height - 20}px` }"></view>
                        <view @touchmove="cutTouchMove" @touchstart="cutTouchStart" @touchend="cutTouchEnd"
                            data-id="leftTop" class="corner-area left-top"></view>
                        <view @touchmove="cutTouchMove" @touchstart="cutTouchStart" @touchend="cutTouchEnd"
                            data-id="rightTop" class="corner-area right-top"></view>
                        <view @touchmove="cutTouchMove" @touchstart="cutTouchStart" @touchend="cutTouchEnd"
                            data-id="rightBottom" class="corner-area right-bottom"></view>
                        <view @touchmove="cutTouchMove" @touchstart="cutTouchStart" @touchend="cutTouchEnd"
                            data-id="leftBottom" class="corner-area left-bottom"></view>
                    </view>
                    <view class="content_middle_right bg_gray" :class="{ 'bg_black': !flag_bright }"
                        :style="{ transitionProperty: cut_animation ? '' : 'background' }">
                    </view>
                </view>
                <view class="content_bottom bg_gray" :class="{ 'bg_black': !flag_bright }"
                    :style="{ transitionProperty: cut_animation ? '' : 'background' }">
                </view>
            </view>
            <image @load="imageLoad" :style="{
                width: img_width ? `${img_width}px` : 'auto',
                height: img_height ? `${img_height}px` : 'auto',
                transform: `translate3d(${img_left - img_width / 2}px, ${img_top - img_height / 2}px, 0) scale(${scale}) rotate(${angle}deg)`,
                transitionDuration: cut_animation ? '.4s' : '0s'
            }" class="img" :src="imgSrc">
            </image>
        </view>
        <canvas canvas-id='image-cropper' disable-scroll="true" :style="{
            width: `${canvas_width * export_scale}px`,
            height: `${canvas_height * export_scale}px`,
            left: `${canvas_left}px`,
            top: `${canvas_top}px`
        }" class="image-cropper-canvas">
        </canvas>
    </view>
</template>
<script>
export default {
    data() {
        return {
            sHeight: 0,//图片容器高度
            imgSrc: '', //图片路径
            img_width: null,//图片宽度
            img_height: null,//图片高度
            width: 375,//裁剪框宽度
            height: 202,//裁剪框高度
            cutSpacing: 10, //裁剪框默認上下左右間距 10px
            min_width: 40,//裁剪框最小尺寸
            min_height: 40,//裁剪框最小尺寸
            max_width: 500,//裁剪框最大尺寸
            max_height: 500,//裁剪框最大尺寸
            disable_width: false,//裁剪框禁止拖动
            disable_height: false,//裁剪框禁止拖动
            disable_ratio: false,// 锁定裁剪框比例
            export_scale: 3,//生成的图片尺寸相对剪裁框的比例
            quality: 1,//生成的图片质量0-1
            cut_top: null,
            cut_left: null,
            canvas_top: null,//canvas上边距（不设置默认不显示）
            canvas_left: null,

            scale: 1,//图片缩放比
            angle: 0,//图片旋转角度
            min_scale: 0.5,//最小缩放比
            max_scale: 2,//最大縮放比
            disable_rotate: false,//是否禁用旋转
            limit_move: false,//是否限制移动范围(剪裁框只能在图片内)
            el: 'image-cropper', //暂时无用
            info: uni.getSystemInfoSync(),
            MOVE_THROTTLE: null, //触摸移动节流settimeout
            MOVE_THROTTLE_FLAG: true, //节流标识
            TIME_BG: null, //背景变暗延时函数
            TIME_CUT_CENTER: null,
            touch_img_relative: [{ //鼠标和图片中心的相对位置
                x: 0,
                y: 0
            }],
            touch_corner_relative: [{ //鼠标和拖拽区域中心的相对位置
                x: 0,
                y: 0
            }],
            flag_cut_touch: true, //是否是拖动裁剪框
            hypotenuse_length: 0, //双指触摸时斜边长度
            flag_img_endtouch: false, //是否结束触摸
            flag_bright: true, //背景是否亮
            canvas_overflow: true, //canvas缩略图是否在屏幕外面
            canvas_width: 200,
            canvas_height: 200,
            origin_x: 0.5, //图片旋转中心
            origin_y: 0.5, //图片旋转中心
            cut_animation: false, //是否开启图片和裁剪框过渡
            cut_animation_time: 0,
            img_top: 0, //图片上边距
            img_left: 0, //图片左边距

            // 当前操作的缩放角
            activeCorner: '',
            // 裁剪框缩放前的位置信息
            clipBoxBeforeScaleClipX: 0,
            clipBoxBeforeScaleClipY: 0,
            // 裁剪框缩放前的宽高
            clipBoxBeforeScaleWidth: 0,
            clipBoxBeforeScaleHeight: 0,
            // 裁剪框缩放前点击鼠标的Page(X|Y)位置信息
            clipBoxBeforeScalePageX: 0,
            clipBoxBeforeScalePageY: 0,
        }
    },
    created() {
        this.info = uni.getSystemInfoSync();
        this.sHeight = this.info.screenHeight - (this.info.screenHeight - this.info.safeArea.bottom) - 86;
        this.img_left = this.info.windowWidth / 2;
        this.img_top = this.sHeight / 2;
        this.canvas_height = this.height;
        this.canvas_width = this.width;
        if (!this.ctx) {
            this.ctx = uni.createCanvasContext("image-cropper", this);
        }
        this.imgSrc && (this.imgSrc = this.imgSrc);
        //设置裁剪框大小>设置图片尺寸>绘制canvas
        this.computeCutSize();
        //检查canvas是否在范围内
        this.canvasDetectionPosition();
        //初始化完成
        this.$emit('commitEvent', { cmd: 'cropperload', value: this });
    },
    methods: {
        /**
         * 返回图片信息
         */
        getImg(getCallback) {
            this._draw(() => {
                uni.canvasToTempFilePath({
                    width: this.width * this.export_scale,
                    height: Math.round(this.height * this.export_scale),
                    destWidth: this.width * this.export_scale,
                    destHeight: Math.round(this.height) * this.export_scale,
                    fileType: 'png',
                    quality: this.quality,
                    canvasId: this.el,
                    success: (res) => {
                        getCallback({
                            url: res.tempFilePath,
                            width: this.width * this.export_scale,
                            height: this.height * this.export_scale
                        });
                    }
                }, this)
            });
        },


        /**
         * 初始化图片，包括位置、大小、旋转角度
         */
        imgReset() {
            this.scale = 1;
            this.angle = 0;
            this.img_top = uni.getSystemInfoSync().windowHeight / 2;
            this.img_left = uni.getSystemInfoSync().windowWidth / 2;
        },
        /**
         * 加载（更换）图片
         */
        pushImg() {
            if (!this.imgSrc) return;
            uni.getImageInfo({
                src: this.imgSrc,
                success: (res) => {
                    this.imageObject = res;
                    //图片非本地路径需要换成本地路径
                    if (this.imgSrc.search(/tmp/) == -1) {
                        this.imgSrc = res.path;
                    }
                    //计算最后图片尺寸
                    this.imgComputeSize();
                    this._imgMarginDetectionScale();
                    this._draw();
                },
                fail: (err) => {
                    this.imgSrc = '';
                    uni.showToast({ title: '加载图片失败' + err, icon: 'none', duration: 2000 });
                }
            });
        },
        //改变截取框大小
        computeCutSize() {
            if (!this.disable_width) {
                let w = this.img_width ? this.img_width : this.info.windowWidth;
                if (this.width >= w) {
                    this.width = w - this.cutSpacing;
                    this.cut_left = this.cutSpacing / 2;
                } else {
                    if (w - this.width <= this.cutSpacing) {
                        this.width = w - this.cutSpacing;
                        this.cut_left = this.cutSpacing / 2;
                    } else if (w - this.width > this.cutSpacing) {
                        this.cut_left = Math.abs(parseInt((w - this.width) / 2));
                    }

                }
            }
            if (!this.disable_height) {
                let h = this.img_height ? this.img_height : this.sHeight;
                if (this.height >= h) {
                    this.height = h - this.cutSpacing;
                    this.cut_top = this.cutSpacing / 2;
                } else {
                    if (h - this.height <= this.cutSpacing) {
                        this.height = h - this.cutSpacing;
                        this.cut_left = this.cutSpacing / 2;
                    } else if (h - this.height > this.cutSpacing) {
                        this.cut_top = Math.abs(parseInt((h - this.height) / 2));
                    }
                }
            }
            !this.canvas_overflow && this._draw();
            console.log(11111, 'computeCutSize', '裁剪框宽高及裁剪框上左边距', this.width, this.height, this.cut_left, this.cut_top);
        },
        /**
        * 计算图片尺寸
        */
        imgComputeSize() {
            let w = this.info.windowWidth;
            let h = this.info.screenHeight - (this.info.screenHeight - this.info.safeArea.bottom) - 86
            if (h / w >= this.imageObject.height / this.imageObject.width) {
                h = parseInt(w * this.imageObject.height / this.imageObject.width);
            } else {
                w = parseInt(h * this.imageObject.width / this.imageObject.height);
            }
            this.img_width = w;
            this.img_height = h;
            this.max_width = this.img_width - this.cutSpacing;
            this.max_height = this.img_height - this.cutSpacing;

            this.height = parseInt(w / this.width * this.height);
            if (this.height >= this.img_height) { //如果裁剪框高度 大于图片实际高度，则把裁剪框实际高度调成正小于图片10个像素高度
                this.height = this.img_height - this.cutSpacing;
            }
            if (this.height < this.min_height) {
                this.height = this.min_height;
            }
            this.width = w - this.cutSpacing;//默认两边留10个像素;
            this.cut_left = Math.abs(parseInt((this.info.windowWidth - this.width) / 2));
            this.cut_top = Math.abs(parseInt((this.sHeight - this.height) / 2));
        },
        imageLoad(e) {
            setTimeout(() => {
                this.$emit('commitEvent', { cmd: 'imageload', value: this.imageObject })
            }, 1000)
        },
        /**
         * 设置图片放大缩小
         */
        setScale(scale) {
            if (!scale) return;
            this.scale = scale;
            !this.canvas_overflow && this._draw();
        },

        /**
         * 检测canvas位置是否在允许的范围内(屏幕内)如果在屏幕外则不开启实时渲染
         * 如果只写一个参数则另一个默认为0，都不写默认超出屏幕外
         */
        canvasDetectionPosition() {
            if (this.canvas_top == null && this.canvas_left == null) {
                this.canvas_overflow = false;
                this.canvas_top = -5000;
                this.canvas_left = -5000;
            } else if (this.canvas_top != null && this.canvas_left != null) {
                if (this.canvas_top < -this.height || this.canvas_top > this.sHeight) {
                    this.canvas_overflow = true;
                } else {
                    this.canvas_overflow = false;
                }
            } else if (this.canvas_top != null && this.canvas_left == null) {
                this.canvas_left = 0;
            } else if (this.canvas_top == null && this.canvas_left != null) {
                this.canvas_top = 0;
                if (this.canvas_left < -this.width || this.canvas_left > this.info.windowWidth) {
                    this.canvas_overflow = true;
                } else {
                    this.canvas_overflow = false;
                }
            }
        },
        onStart(event) {
            if (event.touches.length == 1) {
                this.clipBoxBeforeScalePageX = event.touches[0].pageX;
                this.clipBoxBeforeScalePageY = event.touches[0].pageY;
                this.clipBoxBeforeScaleClipX = this.cut_left;
                this.clipBoxBeforeScaleClipY = this.cut_top;
                this.clipBoxBeforeScaleWidth = this.width;
                this.clipBoxBeforeScaleHeight = this.height;
                this.touch_corner_relative[0] = {
                    x: (this.clipBoxBeforeScalePageX - this.clipBoxBeforeScaleClipX),
                    y: (this.clipBoxBeforeScalePageY - this.clipBoxBeforeScaleClipY),
                }
            }

        },
        onMove(event) {
            if (event.touches.length == 1) {
                //单指拖动
                let left = (event.touches[0].clientX - this.touch_corner_relative[0].x);
                let top = (event.touches[0].clientY - this.touch_corner_relative[0].y);
                if (this.angle == -90 || this.angle == -270) {
                    let imgLeft = this.img_left - this.img_height / 2;
                    this.cut_left = left  < imgLeft ? imgLeft : left;
                    
                    if (this.cut_left + this.width > this.img_height + imgLeft) {
                        this.cut_left =  (this.img_height - this.width + imgLeft);
                    }
                } else {
                    let imgLeft = this.img_left - this.img_width / 2;
                    this.cut_left = left  < imgLeft ? imgLeft : left;
                    if (this.cut_left + this.width > this.img_width + imgLeft) {
                        this.cut_left =  (this.img_width - this.width + imgLeft);
                    }
                }
                if (this.angle == -90 || this.angle == -270) {
                    this.cut_top = top > (this.sHeight - this.img_width) / 2 ? top : (this.sHeight - this.img_width) / 2
                    if (this.cut_top + this.height > this.img_width + (this.sHeight - this.img_width) / 2) {
                        this.cut_top = this.img_width + (this.sHeight - this.img_width) / 2 - this.height;
                    }
                } else {
                    this.cut_top = top > (this.sHeight - this.img_height) / 2 ? top : (this.sHeight - this.img_height) / 2
                    if (this.cut_top + this.height > this.img_height + (this.sHeight - this.img_height) / 2) {
                        this.cut_top = this.img_height + (this.sHeight - this.img_height) / 2 - this.height;
                    }
                }
            }
        },
        cutTouchStart(event) {
            this.activeCorner = event.currentTarget.dataset.id
            this.clipBoxBeforeScalePageX = event.touches[0].pageX;
            this.clipBoxBeforeScalePageY = event.touches[0].pageY;
            this.clipBoxBeforeScaleClipX = this.cut_left;
            this.clipBoxBeforeScaleClipY = this.cut_top;
            this.clipBoxBeforeScaleWidth = this.width;
            this.clipBoxBeforeScaleHeight = this.height;
            this.flag_cut_touch = true;
            console.log(111111,'cutTouchStart',this.flag_cut_touch)

        },
        //裁剪框处理
        cutTouchMove(event) {
            console.log(111111,'cutTouchMove',this.flag_cut_touch)
            if (this.flag_cut_touch) {
                if (this.disable_ratio && (this.disable_width || this.disable_height)) return;

                //节流
                let pageX = event.touches[0].pageX;
                let pageY = event.touches[0].pageY;
                let imgLeft = this.img_left - this.img_width / 2;
                // 缩放在X上的偏移
                let xWidthOffset = this.getScaleXWidthOffset(pageX - this.clipBoxBeforeScalePageX);
                // 裁剪框最小宽度
                let clipW = Math.max(this.clipBoxBeforeScaleWidth + xWidthOffset, this.min_width * (this.info.windowWidth / 375));
                let tempPanelWidth = 0;
                // 设置缩放最大宽度，放大时不能超过面板、缩小时不能超过初始裁剪框
                if (this.angle == -90 || this.angle == -270) {
                    tempPanelWidth = pageX > this.clipBoxBeforeScalePageX ? this.img_height - this.clipBoxBeforeScaleClipX : this.clipBoxBeforeScaleWidth + this.clipBoxBeforeScaleClipX;
                } else {
                    tempPanelWidth = pageX > this.clipBoxBeforeScalePageX ? (this.img_width+imgLeft) - this.clipBoxBeforeScaleClipX : this.clipBoxBeforeScaleWidth + this.clipBoxBeforeScaleClipX;
                }
                // 设置裁剪框宽度
                clipW = Math.min(clipW, tempPanelWidth);
                clipW = clipW > this.max_width ? this.max_width : clipW;
                // 缩放在Y上的偏移
                let yHeightOffset = this.getScaleYHeightOffset(pageY - this.clipBoxBeforeScalePageY);
                // 裁剪框最小高度
                let clipH = Math.max(this.clipBoxBeforeScaleHeight + yHeightOffset, this.min_height * (this.info.windowWidth / 375));
                // 设置缩放最大高度，放大时不能超过面板、缩小时不能超过初始裁剪框
                let tempPanelHeight = 0
                if (this.angle == -90 || this.angle == -270) {
                    if (this.activeCorner == 'rightTop' || this.activeCorner == 'leftTop') {
                        tempPanelHeight = pageY > this.clipBoxBeforeScalePageY ? this.sHeight - this.clipBoxBeforeScaleClipY : this.clipBoxBeforeScaleHeight + (this.clipBoxBeforeScalePageY - pageY);

                    } else if (this.activeCorner == 'rightBottom' || this.activeCorner == 'leftBottom') {
                        tempPanelHeight = pageY > this.clipBoxBeforeScalePageY ? this.sHeight - this.clipBoxBeforeScaleClipY : this.clipBoxBeforeScaleHeight - (this.clipBoxBeforeScalePageY - pageY);
                    }
                } else {
                    tempPanelHeight = pageY > this.clipBoxBeforeScalePageY ? this.sHeight - this.clipBoxBeforeScaleClipY : this.clipBoxBeforeScaleHeight + this.clipBoxBeforeScaleClipY;

                }
                // 设置裁剪框高度
                clipH = Math.min(clipH, tempPanelHeight);
                clipH = clipH > this.max_height ? this.max_height : clipH;
               
                if (!this.disable_width) {
                    this.cut_left = this.getClipX(clipW);
                    if (this.cut_left < this.cutSpacing / 2) {
                        this.cut_left = this.cutSpacing / 2;
                    }
                    this.width = clipW;
                }
                if (!this.disable_height) {
                    this.cut_top = this.getClipY(clipH);
                    if (this.angle == -90 || this.angle == -270) {
                    
                        if (this.cut_top < (this.sHeight - this.img_width) / 2) {
                            this.cut_top = (this.sHeight - this.img_width) / 2;
                           
                        }
                        if (clipH > this.min_height) {
                            this.height = clipH;
                        } else {
                            this.height = this.min_height;
                        }
                    } else {
                        if (this.cut_top < (this.sHeight - this.img_height) / 2) {
                            this.cut_top = (this.sHeight - this.img_height) / 2;
                        }
                        if (this.cut_top + clipH > (this.img_top - this.img_height / 2) + this.img_height) {
                            clipH = (this.img_top - this.img_height / 2) + this.img_height - this.cut_top;
                        }
                        this.height = clipH;
                    }
                }
            }
        },
        cutTouchEnd(event) {
            // this._moveStop();
            this.flag_cut_touch = false;
            console.log(111111,'cutTouchEnd',this.flag_cut_touch)
        },
        /**
      * 设置图片旋转角度
      */
        setAngle(val) {
            // this._moveStop();  //停止居中裁剪框，继续修改图片位置
            if (this.limit_move) {
                if (val % 90) {
                    this.angle = Math.round(val / 90) * 90;
                    this._imgMarginDetectionScale();
                    !this.canvas_overflow && this._draw();
                    return;
                }
            } else {
                let h = 0;
                let w = 0;
                if (this.angle == -90 || this.angle == -270) {
                    h = this.info.windowWidth;
                    w = this.info.screenHeight - (this.info.screenHeight - this.info.safeArea.bottom) - 86

                } else if (this.angle == -180 || this.angle == -360) {
                    w = this.info.windowWidth;
                    h = this.info.screenHeight - (this.info.screenHeight - this.info.safeArea.bottom) - 86
                    if (this.angle == -360) {
                        this.angle = 0;
                    }
                }
                if (h / w >= this.imageObject.height / this.imageObject.width) {
                    h = parseInt(w * this.imageObject.height / this.imageObject.width);
                } else {
                    w = parseInt(h * this.imageObject.width / this.imageObject.height);
                }
                this.img_width = w;
                this.img_height = h;

                let oldW = 375;
                let oldH = 202;
                if (this.angle == -90 || this.angle == -270) {
                    this.max_width = this.img_height;
                    this.max_height = this.img_width;
                    if (this.img_width > this.img_height) {
                        this.height = parseInt(w / oldH * oldH);
                        this.width = (oldH / oldW * oldW);
                    } else {
                        this.width = oldH;
                        this.height = parseInt(w / oldW * oldH);
                        oldW = this.width;
                        oldH = this.height;
                        this.width = oldH;
                        this.height = oldW;
                    }
                    if (this.height >= w) {
                        this.height = w - this.cutSpacing;
                    }
                    if (this.height < this.min_height) {
                        this.height = this.min_height;
                    }
                    if (this.width > h) {
                        this.width = h - this.cutSpacing;
                    }
                   
                } else {
                    this.max_width = this.img_width - this.cutSpacing;
                    this.max_height = this.img_height - this.cutSpacing;
                    this.height = parseInt(w / oldW * oldH);
                    if (this.height >= this.img_height) { //如果裁剪框高度 大于图片实际高度，则把裁剪框实际高度调成正小于图片10个像素高度
                        this.height = this.img_height - this.cutSpacing;
                    }
                    if (this.height < this.min_height) {
                        this.height = this.min_height;
                    }
                    this.width = w - this.cutSpacing;//默认两边留10个像素;
                }
                this.cut_left = Math.abs(parseInt((this.info.windowWidth - this.width) / 2));
                this.cut_top = Math.abs(parseInt((this.sHeight - this.height) / 2));
            }
        },
        /**
      * 检测剪裁框位置是否在允许的范围内(屏幕内)
      */
        _cutDetectionPosition() {
            let _cutDetectionPositionTop = () => {
                //检测上边距是否在范围内
                if (this.cut_top < 0) {
                    this.cut_top = 0;
                }
                if (this.cut_top > this.sHeight - this.height) {
                    this.cut_top = this.sHeight - this.height;
                }
            },
                _cutDetectionPositionLeft = () => {
                    //检测左边距是否在范围内
                    if (this.cut_left < 0) {
                        this.cut_left = 0;
                    }
                    if (this.cut_left > this.info.windowWidth - this.width) {
                        this.cut_left = this.info.windowWidth - this.width;
                    }
                };
            //裁剪框坐标处理（如果只写一个参数则另一个默认为0，都不写默认居中）
            if (this.cut_top == null && this.cut_left == null) {
                this._setCutCenter();
            } else if (this.cut_top != null && this.cut_left != null) {
                _cutDetectionPositionTop();
                _cutDetectionPositionLeft();
            } else if (this.cut_top != null && this.cut_left == null) {
                _cutDetectionPositionTop();
                this.cut_left = (this.info.windowWidth - this.width) / 2;
            } else if (this.cut_top == null && this.cut_left != null) {
                _cutDetectionPositionLeft();
                this.cut_top = (this.sHeight - this.height) / 2;
            }
        },

        /**
         * 图片边缘检测-位置
         */
        _imgMarginDetectionPosition(scale) {
            if (!this.limit_move) return;
            let left = this.img_left;
            let top = this.img_top;
            var scale = scale || this.scale;
            let img_width = this.img_width;
            let img_height = this.img_height;
            if (this.angle / 90 % 2) {
                img_width = this.img_height;
                img_height = this.img_width;
            }
            left = this.cut_left + img_width * scale / 2 >= left ? left : this.cut_left + img_width * scale / 2;
            left = this.cut_left + this.width - img_width * scale / 2 <= left ? left : this.cut_left + this.width - img_width * scale / 2;
            top = this.cut_top + img_height * scale / 2 >= top ? top : this.cut_top + img_height * scale / 2;
            top = this.cut_top + this.height - img_height * scale / 2 <= top ? top : this.cut_top + this.height - img_height * scale / 2;
            this.img_left = left;
            this.img_top = top;
            this.scale = scale;
        },
        /**
         * 图片边缘检测-缩放
         */
        _imgMarginDetectionScale() {
            if (!this.limit_move) return;
            let scale = this.scale;
            let img_width = this.img_width;
            let img_height = this.img_height;
            if (this.angle / 90 % 2) {
                img_width = this.img_height;
                img_height = this.img_width;
            }
            if (img_width * scale < this.width) {
                scale = this.width / img_width;
            }
            if (img_height * scale < this.height) {
                scale = Math.max(scale, this.height / img_height);
            }
            this._imgMarginDetectionPosition(scale);
        },
        _setData(obj) {
            let data = {};
            for (var key in obj) {
                if (this.data[key] != obj[key]) {
                    data[key] = obj[key];
                }
            }
            this.setData(data);
            return data;
        },


        //开始触摸
        _start(event) {
            this.flag_img_endtouch = false;
            //单指拖动
            if (event.touches.length == 1) {
                this.touch_img_relative[0] = {
                    x: (event.touches[0].clientX - this.img_left),
                    y: (event.touches[0].clientY - this.img_top)
                }
            } else {
                //双指放大
                let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX);
                let height = Math.abs(event.touches[0].clientY - event.touches[1].clientY);
                this.touch_img_relative = [{
                    x: (event.touches[0].clientX - this.img_left),
                    y: (event.touches[0].clientY - this.img_top)
                }, {
                    x: (event.touches[1].clientX - this.img_left),
                    y: (event.touches[1].clientY - this.img_top)
                }];
                this.hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            }
            !this.canvas_overflow && this._draw();
        },
        move_throttle() {
            //安卓需要节流
            if (this.info.platform == 'android') {
                clearTimeout(this.MOVE_THROTTLE);
                this.MOVE_THROTTLE = setTimeout(() => {
                    this.MOVE_THROTTLE_FLAG = true;
                }, 1000 / 40)
                return this.MOVE_THROTTLE_FLAG;
            } else {
                this.MOVE_THROTTLE_FLAG = true;
            }
        },
        //点击中间剪裁框处理
        _click(event) {
            if (!this.imgSrc) {
                return;
            }
            this._draw(() => {
                let x = event.detail ? event.detail.x : event.touches[0].clientX;
                let y = event.detail ? event.detail.y : event.touches[0].clientY;
                if ((x >= this.cut_left && x <= (this.cut_left + this.width)) && (y >= this.cut_top && y <= (this.cut_top + this.height))) {
                    //生成图片并回调
                    wx.canvasToTempFilePath({
                        width: this.width * this.export_scale,
                        height: Math.round(this.height * this.export_scale),
                        destWidth: this.width * this.export_scale,
                        destHeight: Math.round(this.height) * this.export_scale,
                        fileType: 'png',
                        quality: this.quality,
                        canvasId: this.el,
                        success: (res) => {
                            this.$emit('commitEvent', {
                                cmd: 'tapcut', value: {
                                    url: res.tempFilePath,
                                    width: this.width * this.export_scale,
                                    height: this.height * this.export_scale
                                }
                            })
                        }
                    }, this)
                }
            });
        },
        //渲染
        _draw(callback) {
            if (!this.imgSrc) return;
            let draw = () => {
                //图片实际大小
                let img_width = this.img_width * this.scale * this.export_scale;
                let img_height = this.img_height * this.scale * this.export_scale;

                //canvas和图片的相对距离
                var xpos = this.img_left - this.cut_left;
                var ypos = this.img_top - this.cut_top;
                //旋转画布
                this.ctx.translate(xpos * this.export_scale, ypos * this.export_scale);
                this.ctx.rotate(this.angle * Math.PI / 180);
                this.ctx.drawImage(this.imgSrc, -img_width / 2, -img_height / 2, img_width, img_height);
                this.ctx.draw(false, () => {
                    callback && callback();
                });
            }
            if (this.ctx) {
                if (this.ctx.width != this.width || this.ctx.height != this.height) {
                    //优化拖动裁剪框，所以必须把宽高设置放在离用户触发渲染最近的地方
                    this.canvas_height = this.height;
                    this.canvas_width = this.width;
                    //延迟40毫秒防止点击过快出现拉伸或裁剪过多
                    setTimeout(() => {
                        draw();
                    }, 40);
                } else {
                    draw();
                }
            }

        },

        //停止移动时需要做的操作
        _moveStop() {
            //清空之前的自动居中延迟函数并添加最新的
            clearTimeout(this.TIME_CUT_CENTER);
            this.TIME_CUT_CENTER = setTimeout(() => {
                //动画启动
                if (!this.cut_animation) {
                    this.cut_animation = true;
                }
                this.setCutCenter();
            }, 1000)
            //清空之前的背景变化延迟函数并添加最新的
            clearTimeout(this.TIME_BG);
            this.TIME_BG = setTimeout(() => {
                if (this.flag_bright) {
                    this.flag_bright = false;
                }
            }, 2000)
        },
        //移动中
        _moveDuring() {
            //清空之前的自动居中延迟函数
            clearTimeout(this.TIME_CUT_CENTER);
            //清空之前的背景变化延迟函数
            clearTimeout(this.TIME_BG);
            //高亮背景
            if (!this.flag_bright) {
                this.flag_bright = true;
            }
        },
        preventTouchMove() { },
        // 处理缩放动作中不同corner时的尺寸位置信息
        getClipX(clipWidth) {
            switch (this.activeCorner) {
                case 'leftTop':
                case 'leftBottom':
                    return this.cut_left + (this.width - clipWidth)
                case 'rightTop':
                case 'rightBottom':
                    return this.cut_left;
                default:
                    return 0
            }
        },
        getClipY(clipHeight) {
            switch (this.activeCorner) {
                case 'leftTop':
                case 'rightTop':
                    let top = this.cut_top;
                    if (clipHeight < this.height) {
                        top = this.cut_top + (this.height - clipHeight);
                    } else {
                        top = this.cut_top - (clipHeight - this.height);
                    }
                    return top;
                case 'leftBottom':
                case 'rightBottom':
                    return this.cut_top;
                default:
                    return 0
            }
        },
        getScaleXWidthOffset(offsetW) {
            switch (this.activeCorner) {
                case 'leftTop':
                case 'leftBottom':
                    return -offsetW
                case 'rightTop':
                case 'rightBottom':
                    return offsetW
                default:
                    return 0
            }
        },
        getScaleYHeightOffset(offsetH) {
            switch (this.activeCorner) {
                case 'rightBottom':
                case 'leftBottom':
                    return offsetH
                case 'rightTop':
                case 'leftTop':
                    return -offsetH
                default:
                    return 0
            }
        },
        /**
 * 设置图片动画
 * {
 *    x:10,//图片在原有基础上向下移动10px
 *    y:10,//图片在原有基础上向右移动10px
 *    angle:10,//图片在原有基础上旋转10deg
 *    scale:0.5,//图片在原有基础上增加0.5倍
 * }
 */
        setTransform(transform) {
            if (!transform) return;
            if (!this.disable_rotate) {
                this.angle = transform.angle ? this.angle + transform.angle : this.angle
            }
            let scale = this.scale;
            if (transform.scale) {
                scale = this.scale + transform.scale;
                scale = scale <= this.min_scale ? this.min_scale : scale;
                scale = scale >= this.max_scale ? this.max_scale : scale;
            }
            this.scale = scale;
            let cutX = this.cut_left;
            let cutY = this.cut_top;
            if (transform.cutX) {
                this.cut_left = cutX + transform.cutX;
                this.watch.cut_left(null, this);
            }
            if (transform.cutY) {
                this.cut_top = cutY + transform.cutY;
                this.watch.cut_top(null, this);
            }
            this.img_top = transform.y ? this.img_top + transform.y : this.img_top;
            this.img_left = transform.x ? this.img_left + transform.x : this.img_left;
            //图像边缘检测,防止截取到空白
            this._imgMarginDetectionScale();
            //停止居中裁剪框，继续修改图片位置
            this._moveDuring();
            !this.canvas_overflow && this._draw();
            //可以居中裁剪框了
            this._moveStop(); //结束操作
        },
        /**
         * 设置剪裁框位置
         */
        setCutXY(x, y) {
            this.cut_top = y;
            this.cut_left = x;
        },

        /**
         * 设置剪裁框和图片居中
         */
        setCutCenter() {
            let cut_top = (this.sHeight - this.height) * 0.5;
            let cut_left = (this.info.windowWidth - this.width) * 0.5;
            //顺序不能变
            this.img_top = this.img_top - this.cut_top + cut_top;
            this.cut_top = cut_top;//截取的框上边距
            this.img_left = this.img_left - this.cut_left + cut_left;
            this.cut_left = cut_left; //截取的框左边距
            console.log(11111, 'setCutCenter', this.img_top, this.cut_top, this.cut_left, this.cut_left)
        },
        _setCutCenter() {
            this.cut_top = (this.sHeight - this.height) * 0.5;
            this.cut_left = (this.info.windowWidth - this.width) * 0.5;
            this._cutDetectionPosition();
            if (this.limit_move) {
                !this.canvas_overflow && that._draw();
            }
        },

        /**
         * 是否锁定旋转
         */
        setDisableRotate(value) {
            this.disable_rotate = value;
        },
        /**
        * 设置剪裁框宽度
        */
        setWidth(w) {
            if (w < this.min_width) {
                this.width = this.min_width;
            } else {
                this.width = w;
            }
            this.computeCutSize();
        },
        /**
         * 设置剪裁框高度
         */
        setHeight(h) {
            if (h < this.min_height) {
                this.height = this.min_height;
            } else {
                this.height = h;
            }
            this.computeCutSize();
        },

        setCutAnimation(val) {
            //开启过渡300毫秒之后自动关闭
            clearTimeout(this.cut_animation_time);
            if (val) {
                this.cut_animation_time = setTimeout(() => {
                    this.cut_animation = false
                }, 300)
            }
        },
        /**
        * 是否限制移动
        */
        setLimitMove(value) {
            this.cut_animation = true;
            this.limit_move = !!value;
            if (value) {
                if (this.angle % 90) {
                    this.angle = Math.round(this.angle / 90) * 90
                }
                this._imgMarginDetectionScale();
                !this.canvas_overflow && this._draw();
            }
        },
        setCanvasTop(val) {
            this.canvas_top = val;
            this.canvasDetectionPosition();
        },
        setCanvasLeft(val) {
            this.canvas_left = val;
            this.canvasDetectionPosition();
        },
        setImgSrc(val) {
            this.imgSrc = val;
        },
        setCutTop(val) {
            this.cut_top = val;
            this._cutDetectionPosition();
            if (this.limit_move) {
                !this.canvas_overflow && this._draw();
            }
        },
        setCutLeft(val) {
            this.cut_left = val;
            this._cutDetectionPosition();
            if (this.limit_move) {
                !this.canvas_overflow && this._draw();
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.image-cropper {
    // position: fixed;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(14, 13, 13, .8);
}

.image-cropper .main {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.image-cropper .content {
    z-index: 9;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    pointer-events: none;
}

.image-cropper .bg_black {
    background: rgba(0, 0, 0, 0.8) !important;
}

.image-cropper .bg_gray {
    background: rgba(0, 0, 0, 0.45);
    transition-duration: .35s;
}

.image-cropper .content>.content_top {
    pointer-events: none;
}

.image-cropper .content>.content_middle {
    display: flex;
    height: 200px;
    width: 100%;
}

.image-cropper .content_middle_middle {
    width: 200px;
    box-sizing: border-box;
    position: relative;
    transition-duration: .3s;
}

.image-cropper .content_middle_right {
    flex: auto;
}

.image-cropper .content>.content_bottom {
    flex: auto;
}

.image-cropper .img {
    z-index: 2;
    top: 0;
    left: 0;
    position: absolute;
    border: none;
    width: 100%;
    backface-visibility: hidden;
    transform-origin: center;
}

.image-cropper .image-cropper-canvas {
    position: fixed;
    background: white;
    width: 150px;
    height: 150px;
    z-index: 10;
    top: -200%;
    pointer-events: none;
}

.image-cropper .corner-area {
    position: absolute;
    pointer-events: auto;
    width: 40rpx;
    height: 40rpx;
}

.image-cropper .corner-cont {
    position: absolute;
    left: 50rpx;
    top: 20rpx;
    pointer-events: auto;
}

.image-cropper .left-top {
    border-top: 2px solid #ffffff;
    border-left: 2px solid #ffffff;
    left: -2px;
    top: -2px;
}

.image-cropper .right-top {
    border-top: 2px solid #ffffff;
    border-right: 2px solid #ffffff;
    right: 0px;
    top: -2px;
}

.image-cropper .right-bottom {
    border-bottom: 2px solid #ffffff;
    border-right: 2px solid #ffffff;
    right: 0px;
    bottom: -2px;
}

.image-cropper .left-bottom {
    border-bottom: 2px solid #ffffff;
    border-left: 2px solid #ffffff;
    left: -2px;
    bottom: -2px;
}
</style>