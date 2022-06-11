import { createStore } from "vuex";

export default createStore({
  state: {
    showInvoiceModal: null,
  },
  getters: {},
  mutations: {
    TOGGLE_INVOICE(state) {
      const nextShowInvoiceModal = !state.showInvoiceModal;

      state.showInvoiceModal = nextShowInvoiceModal;
    },
  },
  actions: {},
  modules: {},
});
