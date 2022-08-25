function clamp(v, min, max) {
    return Math.max(Math.min(v,max), min);
}

const physicsResult = [0, 0, false, false, false, false];
function physicsCheck(myHitbox, physics, canHitHead = true) {
    let x = myHitbox.x;
    let y = myHitbox.y;
    let onGround = false;
    let onRightWall = false;
    let onLeftWall = false;
    let onRoof = false;
    if (myHitbox.isTouching(physics)) {
        // Sides
        if (y - 16 < physics.y + physics.h && y - 16 > physics.y) {
            if (x-10 < physics.x) {
                x = physics.x + physics.ox - myHitbox.ox - myHitbox.w + 0.1;
                onRightWall = true;
            }
            if (x+10 > physics.x + physics.w) {
                x = physics.x + physics.ox + physics.w - myHitbox.ox - 0.1;
                onLeftWall = true;
            }
        }
        if (!onRightWall && !onLeftWall) {
            // Falling to hit top of surface
            if (y - 45 < physics.y) {
                y = physics.y + physics.oy - myHitbox.oy - myHitbox.h + 0.1;
                onGround = true;
            }
            // Hit head on bottom of surface
            if ((y - 15 > physics.y + physics.h) && canHitHead) {
                y = physics.y + physics.oy + physics.h - myHitbox.oy;
                onRoof = true;
            }
        }
    }
    physicsResult[0] = x;
    physicsResult[1] = y;
    physicsResult[2] = onGround;
    physicsResult[3] = onRightWall;
    physicsResult[4] = onLeftWall;
    physicsResult[5] = onRoof;
    return physicsResult;
}

export {
    clamp,
    physicsCheck,
}