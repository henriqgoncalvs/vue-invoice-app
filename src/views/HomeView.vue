<template>
  <div class="home container">
    <!-- Header -->
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are 4 total invoices</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span>Filter by status</span>
          <img src="@/assets/icon-arrow-down.svg" alt="" />

          <ul v-show="showFilterMenu" class="filter-menu">
            <li>Draft</li>
            <li>Pending</li>
            <li>Paid</li>
            <li>Clear filters</li>
          </ul>
        </div>

        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>

    <!-- Invoices -->
    <div v-if="invoiceData.length > 0">
      <InvoiceItem
        v-for="(invoice, index) in filteredData"
        :invoice="invoice"
        :key="index"
      />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>
        Create a new invoice by clicking the New Invoice button and get started
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import InvoiceItem from "@/components/InvoiceItem.vue";

export default {
  name: "HomeView",
  components: { InvoiceItem },
  data() {
    return {
      showFilterMenu: null,
      filteredInvoice: null,
    };
  },
  methods: {
    ...mapMutations(["TOGGLE_INVOICE_MODAL"]),
    newInvoice() {
      this.TOGGLE_INVOICE_MODAL();
      return;
    },
    toggleFilterMenu() {
      const nextShowFilterMenu = !this.showFilterMenu;

      this.showFilterMenu = nextShowFilterMenu;

      return;
    },
    filteredInvoices(e) {
      if (e.target.innerText === "Clear Filter") {
        this.filteredInvoice = null;
        return;
      }
      this.filteredInvoice = e.target.innerText;
    },
  },
  computed: {
    ...mapState(["invoiceData"]),

    filteredData() {
      return this.invoiceData.filter((invoice) => {
        if (this.filteredInvoice === "Draft") {
          return invoice.invoiceDraft === true;
        }
        if (this.filteredInvoice === "Pending") {
          return invoice.invoicePending === true;
        }
        if (this.filteredInvoice === "Paid") {
          return invoice.invoicePaid === true;
        }
        return invoice;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;
        padding: 6px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        img {
          margin-left: 12px;
          width: 30px;
          height: 30px;
          background-color: #fff;
          padding: 10px;
          border-radius: 50%;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 50px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.11),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 12px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          background-color: #fff;
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;

          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }
}
</style>
