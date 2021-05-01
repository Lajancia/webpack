<template>
  <div>
    <h3>Sub App</h3>
    <Remote />
    <Buttonsub />
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from "vue";
// import Content from "./components/Content";
// import Button from "./components/Button";
export default {
  components: {
    Remote: defineAsyncComponent(() => import("./components/Remote")),
    Buttonsub: defineAsyncComponent(() => import("./components/Buttonsub")),
  },
  // components: {
  //   Content,
  //   Button,
  // },
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };

    return {
      count,
      inc,
    };
  },
};
</script>

<style scoped>
img {
  width: 200px;
}
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
