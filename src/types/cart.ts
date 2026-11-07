import { FulfillmentMethod } from '../data/stores';

export interface CartItem {
  productId: string;
  qty: number;
  variant?: string;
}

export interface DeliveryAddress {
  street: string;
  complement: string;
  postalCode: string;
  city: string;
}

export interface DeliveryZone {
  id: string;
  label: string;
  fee: number;
  minOrder: number;
  estimatedTime: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  full: boolean;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isProfessional: boolean;
  siret: string;
  poNumber: string;
  notes: string;
}

export interface CheckoutState {
  step: 1 | 2 | 3 | 4;
  method?: FulfillmentMethod;
  deliveryAddress?: DeliveryAddress;
  deliveryZone?: DeliveryZone;
  date?: string;
  slot?: TimeSlot;
  contact?: Partial<ContactInfo>;
}
