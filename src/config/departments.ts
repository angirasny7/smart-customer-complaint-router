import type { ComplaintCategory } from '../types/complaint';

/**
 * Proposed Category-to-Department Routing Configuration.
 * 
 * NOTE: These are proposed application routing destinations designed to route 
 * customer complaints to appropriate operational teams. They are not 
 * ground-truth department labels derived from the raw Bitext dataset.
 */
export const CATEGORY_DEPARTMENT_MAPPING: Record<ComplaintCategory, string> = {
  ACCOUNT: 'Account Support',
  CANCEL: 'Cancellation Support',
  CONTACT: 'Customer Relations',
  DELIVERY: 'Delivery Support',
  FEEDBACK: 'Customer Feedback Team',
  INVOICE: 'Billing Support',
  ORDER: 'Order Management',
  PAYMENT: 'Payment Support',
  REFUND: 'Refund Support',
  SHIPPING: 'Shipping Support',
  SUBSCRIPTION: 'Subscription Support',
};

export const DEPARTMENT_DESCRIPTIONS: Record<string, string> = {
  'Account Support': 'Handles profile access, login authentication, credentials, and user data privacy.',
  'Cancellation Support': 'Processes cancellation requests for orders, accounts, and active services.',
  'Customer Relations': 'Manages direct communication inquiries, representative transfers, and general contact.',
  'Delivery Support': 'Coordinates carrier logistics, delivery estimates, transit delays, and drop-off issues.',
  'Customer Feedback Team': 'Collects user opinions, platform suggestions, ratings, and service feedback.',
  'Billing Support': 'Handles receipt generation, invoice disputes, tax breakdowns, and payment statements.',
  'Order Management': 'Assists with cart fulfillment, order status checks, and item modifications.',
  'Payment Support': 'Addresses payment gateway errors, card chargebacks, and transaction failures.',
  'Refund Support': 'Validates return requests, stores credit issuance, and coordinates reimbursement.',
  'Shipping Support': 'Tracks shipments, customs dispatches, courier handoffs, and postal inquiries.',
  'Subscription Support': 'Manages recurring plans, renewals, tier upgrades, and pause requests.',
};

export function getDepartmentForCategory(category: ComplaintCategory | string): string {
  if (category in CATEGORY_DEPARTMENT_MAPPING) {
    return CATEGORY_DEPARTMENT_MAPPING[category as ComplaintCategory];
  }
  return 'General Support';
}
