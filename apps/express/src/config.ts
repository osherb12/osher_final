if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const JWT_SECRET = process.env.JWT_SECRET;

export const VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof VALID_ORDER_STATUSES[number];
