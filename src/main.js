import { createApp, provide, h } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import { ApolloClients } from "@vue/apollo-composable";
import client from "./apollo";

const app = createApp({
  setup: () => {
    provide(ApolloClients, client);
  },
  render: () => h(App),
});

app.use(PrimeVue);
app.mount("#app");
