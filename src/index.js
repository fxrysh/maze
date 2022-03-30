fetch('index.wasm')
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, { Math, env: { t() {} } }))
    .then((source) => {
        const instance = source.instance;
        const canvasData = new Uint8Array(
            instance.exports.mem.buffer,
            0x3000,
            307200
        );

        const canvas = document.querySelector('canvas');
        const context = canvas.getContext('2d');
        const imageData = context.createImageData(320, 240);
        const u8 = new Uint8Array(instance.exports.mem.buffer, 0, 4);
        const onkey = (down, event) => {
            switch (event.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    u8[0] = down;
                    break;

                case 'ArrowRight':
                case 'KeyD':
                    u8[1] = down;
                    break;

                case 'ArrowUp':
                case 'KeyW':
                    u8[2] = down;
                    break;

                case 'ArrowDown':
                case 'KeyS':
                    u8[3] = down;
                    break;
            }
        };

        document.addEventListener('keydown', onkey.bind(null, 1), false);
        document.addEventListener('keyup', onkey.bind(null, 0), false);

        let touches = {};
        let ontouch = (down, event) => {
            for (let touch of event.changedTouches) {
                if (down) {
                    if (touch.clientX < event.target.clientWidth * 0.5) {
                        index = 0;
                    } else {
                        index = 1;
                    }

                    u8[index] = 1;
                    touches[touch.identifier] = index;
                } else {
                    u8[touches[touch.identifier]] = 0;
                    delete touches[touch.identifier];
                }
            }

            u8[2] = u8[0] & u8[1];
            event.preventDefault();
        };

        canvas.addEventListener('touchstart', ontouch.bind(null, 1), false);
        canvas.addEventListener('touchend', ontouch.bind(null, 0), false);

        (function update() {
            requestAnimationFrame(update);
            instance.exports.run();
            imageData.data.set(canvasData);
            context.putImageData(imageData, 0, 0);
        })();
    });
