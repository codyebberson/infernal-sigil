import * as bus from './bus';
import { boneMeshAsset, headMeshAsset, regionTitles } from "./assets";
import { canvas, color, renderMesh, renderText } from "./canvas";
import { getBones, getHp, getMaxHp } from "./gamestate";
import { clamp, copy } from "./utils";
import { EVENT_PLAYER_ABILITY_GRANT, EVENT_PLAYER_CHECKPOINT, EVENT_REGION } from './events';

function HUD() {
    let anim = 0;
    
    let regionTitle = 'The Styx';
    let regionTitleTimer = 4;

    const headMesh = copy(headMeshAsset);
    const boneMesh = copy(boneMeshAsset);

    function update(dT) {
        anim += dT;
        regionTitleTimer -= dT;
    }

    function render(ctx) {
        const xfm = ctx.getTransform();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(0.8, 0.8);

        // Render HP
        let hp = getHp();
        for (let i = 0 ; i < getMaxHp(); i++) {
            if (i >= hp) {
                headMesh[0][0] = '#555';
                headMesh[3][0] = '#555';
            } else {
                headMesh[0][0] = '#e22';
                headMesh[3][0] = '#fff';
            }
            renderMesh(headMesh, 50 + i * 55, 72, 0, 0, 0);
        }

        // Render Bone count
        renderMesh(boneMesh, 50, 103, 0, anim, 0);
        renderText(getBones(), 70, 105, '#fff', 30);

        // Region Title
        if (regionTitleTimer > 0) {
            ctx.globalAlpha = clamp(regionTitleTimer, 0, 1) * clamp(-regionTitleTimer + 4, 0, 1);
            ctx.lineWidth = 18;
            color('#000', '#fff');
            renderText(regionTitle, 40, canvas.height * 1.15, '#fff', 100);
            ctx.strokeText(regionTitle, 40, canvas.height * 1.15);
            renderText(regionTitle, 40, canvas.height * 1.15, '#fff', 100);
            ctx.globalAlpha = 1; 
        }

        ctx.setTransform(xfm);
    }

    function onRegionChange(regionId) {
        regionTitle = regionTitles[regionId];
        regionTitleTimer = 4;
    }

    function onCheckpoint() {
        regionTitle = 'Checkpoint';
        regionTitleTimer = 4;
    }

    function onGrant(a) {
        regionTitle = [
            'Twisted Horns - [C] to dash',
            'Iron Claws - Climb walls',
            'Fireball - [V] to cast',
            'Wingspan - [Z] to use',
            'VICTORY!'
        ][a];
        regionTitleTimer = 4;
    }

    bus.on(EVENT_REGION, onRegionChange);
    bus.on(EVENT_PLAYER_CHECKPOINT, onCheckpoint);
    bus.on(EVENT_PLAYER_ABILITY_GRANT, onGrant);

    return {
        update,
        render,
        order: 10000
    }
}

export default HUD;