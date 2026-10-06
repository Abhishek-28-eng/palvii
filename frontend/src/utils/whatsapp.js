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
  trialRequest: (data) => {
    if (!data) return 'Hi Palvii! I would like to request a free trial basket. Please let me know the next steps.';
    return `*New Trial Request* 🌿\n\nHi Palvii, I would like to request a free trial basket!\n\n*Name:* ${data.name}\n*Mobile:* ${data.mobile}\n*Address:* ${data.address}\n*Area:* ${data.area || 'N/A'}\n*Society:* ${data.society || 'N/A'}\n*Family Size:* ${data.family_size || 'N/A'}\n*Preferred Day:* ${data.preferred_delivery_day || 'Any'}\n\nPlease confirm my slot.`;
  },
  generalEnquiry: () => 'Hi Palvii! I have a question about your fresh vegetables.',
  subscriptionEnquiry: () => 'Hi Palvii! I am interested in a subscription plan. Please tell me more.',
};
