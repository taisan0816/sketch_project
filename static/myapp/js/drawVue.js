//戻る, 進む機能の追加.
//画面サイズにあわせて大きさも変える.
//色は拡張性を持たせるためコンポーネントやv-forを使うとか
class Node{
    constructor(data){
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList{
    constructor(imageUrl){
        this.head = new Node(imageUrl);
        this.tail = this.head;
    }

    append(newNode){
        this.tail.next = new Node(newNode);
        this.tail.next.prev = this.tail;
        this.tail = this.tail.next;
    }
}

const konvaApp = Vue.createApp({
    delimiters: ['${', '}'],
    data:() => ({
        //各変数の初期値
        stage: null,
        layer: null,
        isPainting: false,
        //これでdrawモードとeraseモードをわける.
        mode: 'draw',
        lastPointerPosition: {x:null, y:null},
        isSelectedDraw: true,
        isSelectedErase: false,
        drawBtn: null,
        iconColor: 'color:black',
        brushSize: 5,
        brushColor: 'black',
        eraserSize: 10,
        eraserColor: 'white',
        count: null,
    }),
    mounted() {
        //konva.jsのステージを作成
        let container = document.getElementById("container");
        let containerWidth = container.clientWidth;
        let containerHeight = container.clientHeight;
        console.log(containerWidth)
        this.count = 0;
        console.log(0)

        let stage = new Konva.Stage({
            container: 'container',
            width: containerWidth,
            height: containerHeight
        });
        this.stage = stage
        
        //レイヤーを作成
        let layer = new Konva.Layer();
        layer.draw()
        stage.add(layer);
        this.layer = layer
        //マウスが押されたときのイベントを登録する
        //マウスが押されたまま画面外に行ったときの処理も必要
        console.log("--------------------");
        this.stage.on('mousedown touchstart', this.drawStart);
        //マウスが離れたときのイベントを登録
        this.stage.on('mouseup touchend', this.drawEnd);
        this.stage.on('mousemove touchmove', this.drawMove);
    },
    methods: {
        drawStart: function() {
            this.isPainting = true;
            const pos = this.stage.getPointerPosition();
            this.lastPointerPosition = {x: pos.x, y: pos.y}
            console.log("touchstart")
        },
        drawEnd: function() {
            this.isPainting = false;
            this.lastPointerPosition = { x: null, y: null}
            console.log("touchend")
            console.log("dataURL")
            //let dataURL = this.layer.toDataURL('image/jpeg',0.4)
            this.count ++;
            //const LZString=require('./lz-string.js');
            //console.log(dataURL);
            //console.log(dataURL);
            /*var compressed = LZString.compress(uncompressed);
            // 圧縮結果の表示
            console.log(compressed); */
        },
        drawMove: function() {
            if(!this.isPainting) {
                return;
            }

            const pos = this.stage.getPointerPosition()
            //マウスを押してから離れるまでの一本の線を一つのクラスとする.
            if(this.mode === "draw"){
                const newLine = new Konva.Line({
                    //stroke: 線の色を指定する. cf.) dataプロパティ
                    //strokeWidth: 線の太さを指定する. cf.) dataプロパティ
                    //lineCap: 線の端点の形状を指定する. roundは丸い鉛筆と考える
                    //lineJoin: 線と線の交差するときの形状を指定する
                    stroke: this.brushColor,            
                    strokeWidth: this.brushSize,            
                    lineCap: 'round',
                    lineJoin: 'round',
                    points: [this.lastPointerPosition.x, this.lastPointerPosition.y, pos.x, pos.y],
                    
                });
                this.layer.add(newLine);
                this.lastPointerPosition = {x: pos.x, y: pos.y};
                //this.layer.batchDraw()はキャンバス上の変更をバッチ処理して一度に反映するためのメソッド
                this.layer.batchDraw()
            }else{
                const newLine = new Konva.Line({
                    stroke: this.eraserColor,            
                    strokeWidth: this.eraserSize,            
                    lineCap: 'round',
                    lineJoin: 'round',
                    points: [this.lastPointerPosition.x, this.lastPointerPosition.y, pos.x, pos.y],
                });
                this.layer.add(newLine);
                this.lastPointerPosition = {x: pos.x, y: pos.y};
                //this.layer.batchDraw()はキャンバス上の変更をバッチ処理して一度に反映するためのメソッド
                this.layer.batchDraw()
            }
        },

        changeBrushColor: function($event, color) {
            if($event.target.value !== undefined) color = $event.target.value;    
            this.brushColor = color;
            this.iconColor = "color:" + color;
            console.log($event.target.value);
            console.log("color is changed: " + this.brushColor);
        },
        //drawボタンとeraseボタンを押したときに反応するイベントハンドリング
        //モードと枠を変える
        changeMode: function(mode){
            if(this.mode != mode){
                this.mode = mode;
                //枠を変える機能
                this.isSelectedDraw = "draw" === this.mode;
                this.isSelectedErase = "erase" === this.mode;
                console.log("draw:" + this.isSelectedDraw)
                console.log("erase:" + this.isSelectedErase);

            }
        },
        clearAll: function(){
            // レイヤーを取得する
            let layer = this.stage.getLayers()[0];

            // レイヤーをクリアする
            layer.destroyChildren();
            layer.draw();
        },
        changeSize: function($event, stationary){
            if(stationary === "brush"){
                this.brushSize = $event.target.value;
            }else{
                this.eraserSize = $event.target.value;
            }
        },
        undoBtn: function(){
            alert('まだ追加されていない機能です')
        },
        redoBtn: function(){
            alert('まだ追加されていない機能です')
        },

        saveKonva: function(action){
            const formElem = document.querySelector("#form_area");
            const data = new FormData(formElem);
            const url = formElem.action;
            const method = formElem.method;

            const dataURL = this.layer.toDataURL({ pixelRatio: 1 });
            const binary = atob(dataURL.replace(/^.*,/, ""));
            const buffer = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              buffer[i] = binary.charCodeAt(i);
            }
      
            const dt = new Date();
            const filename = dt.toLocaleString().replace(/\/| |:/g, "");
            const file = new File([buffer.buffer], filename + ".png", { type: "image/png" });
      
            data.append("image", file);
            data.forEach((value, key) => {
                console.log(key + ': ' + value);
            });
      
            fetch(url, {
              method: method,
              body: data,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Server response data:", data); // デバッグ用
                if (!data.error) {
                    if (action === "save-and-quit") {
                        // 保存が成功した後、手動でリダイレクトを実行
                        window.location.href = "/index";
                    }else{
                        alert('success save your canvas')
                        
                    }
                  
                }else{
                    alert(data.message)
                    console.log("Server response data:", data); // デバッグ用
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });

              
        }
        /*async saveToDrive() {
            // キャンバスの内容をPNG形式の画像として保存する
            const dataUrl = await this.stage.toDataURL();
            const binary = atob(dataUrl.split(',')[1]);
            const array = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              array[i] = binary.charCodeAt(i);
            }
            const file = new Blob([array], { type: 'image/png' });
      
            // Google Drive APIを使用してファイルをアップロードする
            gapi.client.drive.files.create({
              resource: {
                name: 'konva-image.png',
                parents: ['{folderId}'], // 保存先のフォルダIDを指定する
              },
              media: {
                mimeType: 'image/png',
                body: file,
              },
            }).then((response) => {
              console.log(`File ID: ${response.result.id}`);
            }).catch((error) => {
              console.error(error);
            });
          },*/
    },
})
konvaApp.mount("#mainApp");