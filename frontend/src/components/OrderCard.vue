<script setup lang="ts">
import type { Order } from "../types";
import { useOrderStore } from "../stores/useOrderStore";
import { ORDER_STATUSES, STATUS_LABEL } from "../types";
import type { OrderStatus } from "../types";

const props = defineProps<{ order: Order }>();

const store = useOrderStore();

function onStatusChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as OrderStatus;
  props.order.status = value;
  store.updateStatus(props.order.id, value);
}

function formatTotal(value: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
</script>

<template>
  <article class="card" :class="'status-' + String(order.status).toLowerCase()">
    <div class="card-head">
      <div>
        <p class="ref">{{ order.orderNumber }}</p>
        <h3>{{ order.customerName }}</h3>
      </div>
      <span class="chip" :class="'chip-' + String(order.status).toLowerCase()">
        {{ STATUS_LABEL[order.status] ?? order.status }}
      </span>
    </div>
    <p>{{ order.product }}</p>
    <div class="meta">
      <span>{{ order.location }}</span>
      <span>{{ order.quantity }} st. · {{ formatTotal(order.total) }}</span>
    </div>
    <div class="actions">
      <label>
        Status
        <select :value="order.status" @change="onStatusChange">
          <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
            {{ STATUS_LABEL[status] }}
          </option>
        </select>
      </label>
      <router-link class="btn" :to="{ name: 'order-detail', params: { id: order.id } }">
        Openen
      </router-link>
    </div>
  </article>
</template>
