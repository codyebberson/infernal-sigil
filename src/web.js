import { BoundingBox } from "./bbox";
import { renderMesh } from "./canvas";
import * as bus from './bus';

function Web(x, y) {
    y -= 50;
    let size = 100;
    let step = 1;
    let burnup = false;
    let anim = 0;
    let cx = 0;
    let cy = 0;
    let omx = 0;
    let omy = 0;
    const webMesh = [
        ['#fff', 4, 0]
    ];
    // build a procedural web
    const angles = [];
    const rads = [];
    for (let i = 0; i < 8; i++) {
        let a = -2.3 + (Math.random() - 0.5)/4 + (i%4)/2;
        if (i > 3) { a += 3.14; }
        const R = (size + 10) / Math.abs(Math.sin(a));
        angles.push(a);
        rads.push(R);
        webMesh.push([0, 0, Math.cos(a) * R, Math.sin(a) * R]);
    }
    const webbing = new Array(64);
    webMesh.push(webbing);
    const physics = new BoundingBox(x-50, y-100, 0, 0, 100, 200);

    function update(dT) {
        anim += dT * 56;
        omx -= omx * 5 * dT;
        omy -= omy * 5 * dT;
        cx = omx * Math.cos(anim);
        cy = omy * Math.cos(anim / 1.4);
        updateWebPos();

        if (burnup) {
            return true;
        }
    }

    function render(ctx) {
        renderMesh(webMesh, x, y, 0, 0, 0);
    }

    function updateWebPos() {
        for (let i = 0; i < 8; i++) {
            webMesh[1 + i][0] = cx;
            webMesh[1 + i][1] = cy;
        }
        for (let i = 0; i < 32 / step; i++) {
            const a = angles[i % 8];
            const p =(i * step / 70 + 0.07) / (1 - Math.abs(Math.sin(a)) * 0.5);
            const r = rads[i % 8] * p;
            webbing[i*2] = Math.cos(a) * r + cx * (1 - p);
            webbing[i*2+1] = Math.sin(a) * r + cy * (1 - p);
        }
    }

    function hitCheck([attackHitbox, dir, owner, flames]) {
        if (physics.isTouching(attackHitbox)) {
            omx = 10;
            omy = 8;
            if (flames) {
                burnup = true;
            }
            bus.emit('attack:hit', [owner]);
        }
    }

    function enable() {
        bus.on('attack', hitCheck);
    }

    function disable() {
        bus.off('attack', hitCheck);
    }

    updateWebPos();

    return {
        update,
        render,
        enable,
        disable,
        order: -9000,
        tags: ['physics'],
        physics,
    };
}

export default Web;