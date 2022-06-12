<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <form @submit.prevent="submitForm" class="invoice-content">
      <TheLoading v-show="loading" />
      <h1>New Invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>

        <FormInputText
          id="billerStreetAddress"
          label="Street Address"
          v-model="billerStreetAddress"
        />

        <div class="location-details flex">
          <FormInputText id="billerCity" label="City" v-model="billerCity" />
          <FormInputText
            id="billerZipCode"
            label="Zip Code"
            v-model="billerZipCode"
          />
          <FormInputText
            id="billerCountry"
            label="Country"
            v-model="billerCountry"
          />
        </div>
      </div>

      <!-- Bill To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>

        <FormInputText
          id="clientName"
          label="Client's Name"
          v-model="clientName"
        />

        <FormInputText
          id="clientEmail"
          label="Client's Email"
          v-model="clientEmail"
        />

        <FormInputText
          id="clientStreetAddress"
          label="Client's Street Address"
          v-model="clientStreetAddress"
        />

        <div class="location-details flex">
          <FormInputText
            id="clientCity"
            label="Client's City"
            v-model="clientCity"
          />
          <FormInputText
            id="clientZipCode"
            label="Client's Zip Code"
            v-model="clientZipCode"
          />
          <FormInputText
            id="clientCountry"
            label="Client's Country"
            v-model="clientCountry"
          />
        </div>

        <!-- Invoice Work Details -->
        <div class="invoice-work flex flex-column">
          <div class="payment flex">
            <FormInputText
              :disabled="true"
              id="invoiceDate"
              label="Invoice Date"
              v-model="invoiceDate"
            />

            <FormInputText
              :disabled="true"
              id="paymentDueDate"
              label="Payment Due"
              v-model="paymentDueDate"
            />
          </div>

          <FormInputSelect
            id="paymentTerms"
            label="Payment Terms"
            v-model="paymentTerms"
            :options="paymentTermsOptions"
          />

          <FormInputText
            id="productDescription"
            label="Product Description"
            v-model="productDescription"
          />

          <div class="work-items">
            <h3>Item List</h3>
            <table class="item-list">
              <tr class="table-heading flex">
                <th class="item-name">Item Name</th>
                <th class="qty">Qty</th>
                <th class="price">Price</th>
                <th class="total">Toal</th>
              </tr>
              <tr
                class="table-items flex"
                v-for="(item, index) in invoiceItemList"
                :key="index"
              >
                <td class="item-name">
                  <input type="text" v-model="item.itemName" />
                </td>
                <td class="qty"><input type="text" v-model="item.qty" /></td>
                <td class="price">
                  <input type="text" v-model="item.price" />
                </td>
                <td class="total flex">
                  ${{ (item.total = item.qty * item.price) }}
                </td>
                <img
                  @click="deleteInvoiceItem(item.id)"
                  src="@/assets/icon-delete.svg"
                  alt=""
                />
              </tr>
            </table>

            <div @click="addNewInvoiceItem" class="flex button">
              <img src="@/assets/icon-plus.svg" alt="" />
              Add New Item
            </div>
          </div>
        </div>

        <div class="save flex">
          <div class="left">
            <button type="button" @click="closeInvoice" class="red">
              Cancel
            </button>
          </div>
          <div class="right flex">
            <button @click="saveDraft" class="dark-purple">Save Draft</button>

            <button v-if="editInvoice" @click="publishInvoice" class="purple">
              Edit Invoice
            </button>
            <button v-else @click="publishInvoice" class="purple">
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import { uid } from "uid";
import db from "@/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

import FormInputText from "@/components/inputs/FormInputText.vue";
import FormInputSelect from "@/components/inputs/FormInputSelect.vue";
import TheLoading from "@/components/TheLoading.vue";

export default {
  name: "InvoiceModal",
  components: { FormInputText, FormInputSelect, TheLoading },
  data() {
    return {
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      docId: null,
      loading: null,
      billerStreetAddress: "",
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      productDescription: null,
      invoicePending: null,
      paymentTermsOptions: [
        {
          value: 30,
          label: "Next 30 Days",
        },
        {
          value: 60,
          label: "Next 60 Days",
        },
      ],
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },
  created() {
    if (!this.editInvoice) {
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString(
        "en-us",
        this.dateOptions
      );
    }
    if (this.editInvoice) {
      const currentInvoice = this.currentInvoiceArray[0];
      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStreetAddress = currentInvoice.clientStreetAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountry = currentInvoice.clientCountry;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }
  },
  methods: {
    ...mapMutations([
      "TOGGLE_INVOICE_MODAL",
      "TOGGLE_MODAL",
      "TOGGLE_EDIT_INVOICE",
    ]),
    ...mapActions(["GET_INVOICES", "UPDATE_INVOICE"]),
    checkClick(e) {
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_MODAL();
      }
    },
    closeInvoice() {
      this.TOGGLE_INVOICE_MODAL();
      if (this.editInvoice) {
        this.TOGGLE_EDIT_INVOICE();
      }
    },
    addNewInvoiceItem() {
      this.invoiceItemList.push({
        id: uid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },
    deleteInvoiceItem(id) {
      this.invoiceItemList = this.invoiceItemList.filter(
        (item) => item.id !== id
      );
    },
    calculateInvoiceTotal() {
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach((invoiceItem) => {
        this.invoiceTotal += invoiceItem.total;
      });
    },
    publishInvoice() {
      this.invoicePending = true;
    },
    saveDraft() {
      this.invoiceDraft = true;
    },
    async uploadInvoice() {
      if (!this.invoiceItemList.length) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;
      this.calculateInvoiceTotal();

      try {
        await addDoc(collection(db, "invoices"), {
          invoiceId: uid(6),
          billerStreetAddress: this.billerStreetAddress,
          billerCity: this.billerCity,
          billerZipCode: this.billerZipCode,
          billerCountry: this.billerCountry,
          clientName: this.clientName,
          clientEmail: this.clientEmail,
          clientStreetAddress: this.clientStreetAddress,
          clientCity: this.clientCity,
          clientZipCode: this.clientZipCode,
          clientCountry: this.clientCountry,
          invoiceDate: this.invoiceDate,
          invoiceDateUnix: this.invoiceDateUnix,
          paymentTerms: this.paymentTerms,
          paymentDueDate: this.paymentDueDate,
          paymentDueDateUnix: this.paymentDueDateUnix,
          productDescription: this.productDescription,
          invoiceItemList: this.invoiceItemList,
          invoiceTotal: this.invoiceTotal,
          invoicePending: this.invoicePending,
          invoiceDraft: this.invoiceDraft,
          invoicePaid: null,
        });

        this.TOGGLE_INVOICE_MODAL();
        this.GET_INVOICES();
      } catch (e) {
        alert("There was an error when trying to add Invoice");
        console.error("Error adding document: ", e);
      }

      this.loading = false;
    },
    async updateInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Please ensure you filled out work items!");
        return;
      }

      this.loading = true;
      this.calculateInvoiceTotal();

      const invoiceToUpdate = doc(db, "invoices", this.docId);

      await updateDoc(invoiceToUpdate, {
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
      });

      this.loading = false;

      const data = {
        docId: this.docId,
        routeId: this.$route.params.invoiceId,
      };

      this.UPDATE_INVOICE(data);
    },
    submitForm() {
      if (this.editInvoice) {
        this.updateInvoice();
        return;
      }
      this.uploadInvoice();
    },
  },
  computed: {
    ...mapState(["editInvoice", "currentInvoiceArray"]),
  },
  watch: {
    paymentTerms() {
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.paymentTerms)
      );
      this.paymentDueDate = new Date(
        this.paymentDueDateUnix
      ).toLocaleDateString("en-us", this.dateOptions);
    },
  },
};
</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }
  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }
    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;
      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }
    // Invoice Work
    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }
      .work-items {
        .item-list {
          width: 100%;
          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;
            .item-name {
              flex-basis: 50%;
            }
            .qty {
              flex-basis: 10%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }
          .table-heading {
            margin-bottom: 16px;
            th {
              text-align: left;
            }
          }
          .table-items {
            position: relative;
            margin-bottom: 24px;
            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }

            input {
              width: 100%;
              background-color: #1e2139;
              color: #fff;
              border-radius: 4px;
              padding: 12px 4px;
              border: none;
              &:focus {
                outline: none;
              }
              &:disabled {
                background-color: #545774;
                cursor: not-allowed;
              }
            }
          }
        }
        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;
          img {
            margin-right: 4px;
          }
        }
      }
    }
    .save {
      margin-top: 60px;
      div {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
      }
    }
  }
}
</style>
