<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useOrderStore } from "../stores/useOrderStore";
import OrderList from "../components/OrderList.vue";
import { describeApiError } from "../services/api";

const store = useOrderStore();
const query = ref("");
const loadError = ref<string | null>(null);

onMounted(async () => {
  try {
    await store.loadOrders();
  } catch (err) {
    loadError.value = describeApiError(err);
  }
});

async function reload() {
  loadError.value = null;
  try {
    //await store.loadOrders();
  } catch (err) {
    loadError.value = describeApiError(err);
  }
}
</script>

<template>
  <p class="lede">
    Bestellingen voor zorglocaties. Zet een status of open een regel voor details.
  </p>

  <div class="toolbar">
    <label>
      Zoeken
      <input v-model="query" type="search" placeholder="Nummer, locatie, product, aanvrager" />
    </label>
    <button type="button" @click="reload">Opnieuw laden</button>
  </div>

  <p v-if="store.loading" class="note">Bestellingen laden…</p>
  <p v-if="loadError" class="error">{{ loadError }}</p>
  <p v-else-if="!store.loading" class="note">{{ store.orders.length }} bestellingen</p>

  <OrderList :query="query" />
</template>
