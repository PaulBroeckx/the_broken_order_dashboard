import { defineStore } from "pinia";
import { ref } from "vue";
import type { Order, OrderStatus } from "../types";
import { fetchOrderApi, fetchOrdersApi, updateOrderStatusApi } from "../services/api";

export const useOrderStore = defineStore("orders", () => {
  let orders = ref<Order[]>([]);
  const currentOrder = ref<Order | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadOrders() {
    loading.value = true;
    error.value = null;
    try {
      const data = await fetchOrdersApi();
      orders.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Orders laden mislukt";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadOrder(id: number) {
    loading.value = true;
    error.value = null;
    try {
      currentOrder.value = await fetchOrderApi(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Order laden mislukt";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(orderId: number, newStatus: OrderStatus) {
    await updateOrderStatusApi(orderId, newStatus);
    const order = orders.value.find((item) => item.id === orderId);
    if (order) {
      order.status = newStatus;
    }
    if (currentOrder.value?.id === orderId) {
      currentOrder.value.status = newStatus;
    }
  }

  return { orders, currentOrder, loading, error, loadOrders, loadOrder, updateStatus };
});
