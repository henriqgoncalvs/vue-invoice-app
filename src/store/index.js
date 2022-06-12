import { createStore } from "vuex";

export default createStore({
  state: {
    showInvoiceModal: null,
  },
  getters: {},
  mutations: {
    TOGGLE_INVOICE_MODAL(state) {
      const nextShowInvoiceModal = !state.showInvoiceModal;

      state.showInvoiceModal = nextShowInvoiceModal;
    },
  },
  actions: {},
  modules: {},
});
