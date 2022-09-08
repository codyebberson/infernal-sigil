const headMeshAsset = [
    ['#e22', 9, 0],
    [14, -40, 18, -26, 1, 0, -1, 0, -18, -26, -14, -40],
    [-7, -11, 7, -11],
    ['#fff', 4, 5],
    [-9, -11, -3, -9],
    [9, -11, 3, -9],
];

const boneMeshAsset = [
    ['#fff', 6, 0],
    [-11, -7, -7, -7, 7, 7, 7, 11],
    [-7, -11, -7, -7, 7, 7, 11, 7],
];

const symbolMeshAssets = [
    [['#4af', 2, 0], [10, -12, 15, 12, -15, 12, 0, 0, -10, 0]], // Horns --> Dash
    [['#4af', 2, 0], [10, -15, -10, -7, 10, 0, -10, 7, 10, 15]], // 3-claw --> Climb
    [['#4af', 2, 0], [0, -18, 0, -5, 12, 0, 0, 12, -12, 0]], // Hook --> Fireball
    [['#4af', 2, 0], [-15, -11, -15, 11, 0, 11, 0, -11, 15, -11, 15, 11]], // Aztec --> Wings
    [['#4af', 2, 0], [0, -15, 10, 0, 0, 15, -10, 0, 0, -15]], // Diamond --> End game?
];

const regionTitles = [
    'The Crossroads',
    'Undergrowth',
    'Boneyard Caverns',
    'Fields of Mourning',
    'Throne Room',
];

export {
    headMeshAsset,
    boneMeshAsset,
    symbolMeshAssets,
    regionTitles,
};