import { workOrders } from '../mock/data'
import type { WorkOrder } from '../mock/data'

function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const productionApi = {
  getWorkOrders: async (): Promise<WorkOrder[]> => {
    await delay()
    return [...workOrders]
  },
}
