const FPS = 60;

let DARK_MODE = (
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches
);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    DARK_MODE = e.matches;

    const heading = document.querySelector("#heading");
    if(DARK_MODE)
        heading.innerHTML = `
            <span style='color: rgb(255, 23, 68);'>Red</span>
            <span style='color: black;'><strike>Black</strike></span>
            White Tree Visualization
        `;
    else
        heading.innerHTML = `
            <span style='color: rgb(255, 23, 68);'>Red</span>
            Black Tree Visualization
        `;
});
