import * as rnd from "./js/render system/render.js";

window.addEventListener("load", () => {
    new rnd.Render("cube canvas", "cube").start();
    new rnd.Render("obj canvas", "obj").start();
});
