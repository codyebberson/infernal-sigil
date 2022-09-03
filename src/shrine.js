import { BoundingBox, isTouching } from "./bbox";
import { ctx, renderMesh } from "./canvas";
import { add, getObjectsByTag } from "./engine";
import * as bus from './bus';
import { symbolMeshAssets } from "./assets";
import { copy } from "./utils";

function Shrine(x, y, grantType) {
    let anim = 0;
    let engaging = 0;
    let used = false;
    let timeSinceUpgrade = 0;

    const platformMesh = [
        ['#777', 5, 0],
        [200, 60, -200, 60, -200, 0, -100, 0, -100, -50, 100, -50, 100, 0, 200, 0, 200, 60]
    ];
    const bloodMesh = [
        ['#911', 10, 0],
        [-100, -40, -100, -50, 100, -50, 100, -25],
        [-70, -50, -70, -25],
        [40, -50, 40, -15],
        [60, -50, 60, -35],
    ];
    const pentagramMesh = [
        ['#fff', 6, 0],
    ];
    let a1 = [];
    let a2 = [];
    const step = 6.28/5;
    for (let i = 0; i < 6; i++) {
        a1.push(Math.sin(i * step) * 100, -Math.cos(i * step) * 100);
        a2.push(Math.sin(i * step * 2) * 100, -Math.cos(i * step * 2) * 100);
    }
    pentagramMesh.push(a1, a2);
    const symbolMeshes = copy(symbolMeshAssets);

    const gradient = ctx.createLinearGradient(x, y-50, x, y-250);
    gradient.addColorStop(0, 'rgba(255,255,110,0.5)');
    gradient.addColorStop(0.3, 'rgba(255,255,110,0.2)');
    gradient.addColorStop(1, 'rgba(255,255,110,0.0)');

    const physics = new BoundingBox(x-200,y,0,0,400,50);
    const physics2 = new BoundingBox(x-100,y-50,0,0,200,50);
    const touchbox = new BoundingBox(x-75,y-60,0,0,150,10);
    const secondPhysics = { tags: ['physics'], physics: physics2 };

    function update(dT) {
        anim += dT;

        if (!used) {
            if (isTouching(touchbox, getObjectsByTag('player')[0].playerHitbox)) {
                engaging += dT;
                const cam = getObjectsByTag('camera')[0];
                const alpha = engaging / 3;
                const beta = 1 - alpha;
                cam.aim(cam.getX() * beta + x * alpha, cam.getY() * beta + (y-100) * alpha, 1 + Math.sqrt(engaging) * 0.4 * alpha, alpha);
                if (engaging > 3) {
                    engage();
                }
            } else {
                engaging -= engaging * 2 * dT;
            }
        } else {
            engaging = 3;
            timeSinceUpgrade += dT;
        }
    }

    function engage() {
        used = true;
        pentagramMesh[0][0] = '#ee2';
        symbolMeshes.map((m) => { m[0][0] = '#ee2'; });
        for (let i = 0; i < 20; i++) {
            bus.emit('bone:spawn', [x+(Math.random() - 0.5) * 150,y-100,1,1]);
        }
        bus.emit('player:grant', grantType);
        timeSinceUpgrade = 0;
    }

    function render(ctx) {
        const dy = -200 + Math.sin(anim*2) * 5;
        renderMesh(platformMesh, x, y, 0, 0, 0, '#777');
        if (used) {
            pentagramMesh[0][1] = 4;
            ctx.fillStyle = gradient;
            ctx.fillRect(x - 100, y - 250, 200, 200);
        } else {
            ctx.globalAlpha = Math.cos(engaging * engaging * 10) * 0.5 + 0.5;
            pentagramMesh[0][1] = 6 * (1-engaging/3);
        }
        renderMesh(pentagramMesh, x, y + dy, 0, 0, -engaging*1.256/3);
        ctx.globalAlpha = 1;
        renderMesh(bloodMesh, x, y, 0, 0, 0);
        for (let i = 0; i < 5; i++) {
            const dr = Math.cos(i*0.2 + anim * 3) * 3 + 130;
            renderMesh(symbolMeshes[grantType], x + Math.sin(i * step) * dr, y + dy - Math.cos(i * step) * dr, 0, 0, engaging * engaging * 7 * (i % 2 - 0.5));
        }
    }

    function enable() {
        add(secondPhysics);
    }

    function disable() {
        remove(secondPhysics);
    }

    return {
        update,
        render,
        enable,
        disable,
        tags: ['physics'],
        physics,
        order: -8000
    };
}

export default Shrine;