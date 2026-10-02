/**
 * WhatsApp utility — number always comes from env, never hardcoded
 */
const getWhatsAppNumber = () => {
  return import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
};

export const generateWhatsAppLink = (message) => {
  const number = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
};

export const openWhatsApp = (message) => {
  window.open(generateWhatsAppLink(message), '_blank');
};

export const whatsAppMessages = {
  orderBasket: () => 'Hi Palvii! I would like to order a vegetable basket. Please help me.',
  trialRequest: () => 'Hi Palvii! I would like to request a free trial basket. Please let me know the next steps.',
  generalEnquiry: () => 'Hi Palvii! I have a question about your fresh vegetables.',
  subscriptionEnquiry: () => 'Hi Palvii! I am interested in a subscription plan. Please tell me more.',
};
