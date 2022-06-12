import { createStore } from "vuex";

export default createStore({
  state: {
    showInvoiceModal: null,
    editInvoice: null,
  },
  getters: {},
  mutations: {
    TOGGLE_INVOICE_MODAL(state) {
      const nextShowInvoiceModal = !state.showInvoiceModal;

      state.showInvoiceModal = nextShowInvoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
  },
  actions: {},
  modules: {},
});
