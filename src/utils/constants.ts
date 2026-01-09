export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const settings = {};

// Маппинг категорий теперь строго типизирован, если нужно
export const categoryMap: Record<string, string> = {
  "софт-скил": "card__category_soft",
  "хард-скил": "card__category_hard",
  "кнопка": "card__category_button",
  "дополнительное": "card__category_additional",
  "другое": "card__category_other",
};

export const PRODUCT_URL = "/product";
export const ORDER_URL = "/order";