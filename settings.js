const FPS = 60;

let DARK_MODE = (
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches
);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    DARK_MODE = e.matches;
});