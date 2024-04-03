import "./app.css";
import "@fontsource-variable/figtree";
import "overlayscrollbars/overlayscrollbars.css";

import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
