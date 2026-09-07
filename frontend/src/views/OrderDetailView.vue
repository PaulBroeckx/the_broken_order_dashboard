<script setup lang="ts">
import { onMounted } from "vue";
import { useOrderStore } from "../stores/useOrderStore";
import { ORDER_STATUSES, STATUS_LABEL } from "../types";
import type { OrderStatus } from "../types";

const props = defineProps<{ id: string }>();
const store = useOrderStore();

onMounted(async () => {
  await store.loadOrder(Number(props.id));
});

function onStatusChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as OrderStatus;
  if (store.currentOrder) {
    store.updateStatus(store.currentOrder.id, value);
  }
}

function formatTotal(value: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
</script>

<template>
  <p>
    <router-link to="/">← Alle bestellingen</router-link>
  </p>

  <p v-if="store.loading" class="note">Bestelling laden…</p>
  <p v-else-if="store.error" class="error">{{ store.error }}</p>

  <article v-else-if="store.currentOrder" class="detail">
    <p class="eyebrow">{{ store.currentOrder.orderNumber }}</p>
    <h1>{{ store.currentOrder.customerName }}</h1>
    <dl>
      <dt>Locatie</dt>
      <dd>{{ store.currentOrder.location }}</dd>
      <dt>Artikel</dt>
      <dd>{{ store.currentOrder.product }}</dd>
      <dt>Aantal</dt>
      <dd>{{ store.currentOrder.quantity }}</dd>
      <dt>Bedrag</dt>
      <dd>{{ formatTotal(store.currentOrder.total) }}</dd>
      <dt>Aanvrager</dt>
      <dd>{{ store.currentOrder.orderedBy }}</dd>
      <dt>Aangemaakt</dt>
      <dd>{{ formatDate(store.currentOrder.createdAt) }}</dd>
      <dt>Status</dt>
      <dd>
        <select :value="store.currentOrder.status" @change="onStatusChange">
          <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
            {{ STATUS_LABEL[status] }}
          </option>
        </select>
      </dd>
    </dl>
  </article>
</template>
