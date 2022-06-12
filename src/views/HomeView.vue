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
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      showFilterMenu: null,
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
