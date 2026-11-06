import type { CategoryInfo } from '../types/complaint';
import { CATEGORY_DEPARTMENT_MAPPING } from './departments';

export const COMPLAINT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'ACCOUNT',
    name: 'Account',
    description: 'Inquiries regarding user profiles, account access, login credentials, and personal details.',
    department: CATEGORY_DEPARTMENT_MAPPING.ACCOUNT,
    color: '#3B82F6', // Blue
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    id: 'CANCEL',
    name: 'Cancellation',
    description: 'Requests to terminate service contracts, cancel pending orders, or stop ongoing memberships.',
    department: CATEGORY_DEPARTMENT_MAPPING.CANCEL,
    color: '#EF4444', // Red
    badgeBg: 'bg-red-50 dark:bg-red-950/40',
    badgeText: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  {
    id: 'CONTACT',
    name: 'Contact & Support',
    description: 'Direct inquiries seeking representative contact, customer care phone numbers, and communication channels.',
    department: CATEGORY_DEPARTMENT_MAPPING.CONTACT,
    color: '#8B5CF6', // Purple
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    id: 'DELIVERY',
    name: 'Delivery',
    description: 'Reports on delivery scheduling, missed drop-offs, carrier delays, and doorstep handover.',
    department: CATEGORY_DEPARTMENT_MAPPING.DELIVERY,
    color: '#F59E0B', // Amber
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  {
    id: 'FEEDBACK',
    name: 'Feedback',
    description: 'User reviews, service ratings, platform compliments, and constructive experience feedback.',
    department: CATEGORY_DEPARTMENT_MAPPING.FEEDBACK,
    color: '#10B981', // Emerald
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'INVOICE',
    name: 'Invoice',
    description: 'Requests for itemized invoice receipts, tax documentation, and breakdown of billing charges.',
    department: CATEGORY_DEPARTMENT_MAPPING.INVOICE,
    color: '#06B6D4', // Cyan
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    borderColor: 'border-cyan-200 dark:border-cyan-800',
  },
  {
    id: 'ORDER',
    name: 'Order',
    description: 'General order tracking, order placement confirmation, item modifications, and cart queries.',
    department: CATEGORY_DEPARTMENT_MAPPING.ORDER,
    color: '#6366F1', // Indigo
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
  {
    id: 'PAYMENT',
    name: 'Payment',
    description: 'Payment gateway errors, double debits, declined credit cards, and transaction issues.',
    department: CATEGORY_DEPARTMENT_MAPPING.PAYMENT,
    color: '#EC4899', // Pink
    badgeBg: 'bg-pink-50 dark:bg-pink-950/40',
    badgeText: 'text-pink-700 dark:text-pink-300',
    borderColor: 'border-pink-200 dark:border-pink-800',
  },
  {
    id: 'REFUND',
    name: 'Refund',
    description: 'Requests for money-back processing, refund approval status, and reimbursement timelines.',
    department: CATEGORY_DEPARTMENT_MAPPING.REFUND,
    color: '#14B8A6', // Teal
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  {
    id: 'SHIPPING',
    name: 'Shipping',
    description: 'Shipment dispatch confirmation, tracking numbers, customs clearance, and courier routing.',
    department: CATEGORY_DEPARTMENT_MAPPING.SHIPPING,
    color: '#F97316', // Orange
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  {
    id: 'SUBSCRIPTION',
    name: 'Subscription',
    description: 'Monthly/annual subscription renewals, tier plan adjustments, and recurring billing queries.',
    department: CATEGORY_DEPARTMENT_MAPPING.SUBSCRIPTION,
    color: '#84CC16', // Lime
    badgeBg: 'bg-lime-50 dark:bg-lime-950/40',
    badgeText: 'text-lime-700 dark:text-lime-300',
    borderColor: 'border-lime-200 dark:border-lime-800',
  },
];

export const CATEGORY_MAP = new Map<string, CategoryInfo>(
  COMPLAINT_CATEGORIES.map((cat) => [cat.id, cat])
);

export function getCategoryInfo(id: string): CategoryInfo | undefined {
  return CATEGORY_MAP.get(id.toUpperCase());
}
