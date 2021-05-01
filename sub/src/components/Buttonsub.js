import { render, h } from "vue";
const button = {
  name: "btn-component",
  render() {
    return h(
      "button",
      {
        id: "btn-primary",
      },
      "This is sub"
    );
  },
};
export default button;
