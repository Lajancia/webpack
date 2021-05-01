import { createApp, defineAsyncComponent } from "vue";
import Layout from "./Layout.vue";

const Content = defineAsyncComponent(() => import("home/Content"));
const Button = defineAsyncComponent(() => import("home/Button"));

const Remote = defineAsyncComponent(() => import("sub/Remote"));
const Buttonsub = defineAsyncComponent(() => import("sub/Buttonsub"));

const app = createApp(Layout);

app.component("remote-element", Remote);
app.component("buttonsub-element", Buttonsub);
app.component("content-element", Content);
app.component("button-element", Button);

app.mount("#app");
