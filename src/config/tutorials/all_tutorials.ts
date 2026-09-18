import { BUYER_TUTORIALS } from './buyer_tutorials';
import { ORG_TUTORIALS } from './org_tutorials';
import { SELLER_TUTORIALS } from './seller_tutorials';

export const TUTORIALS = { ...ORG_TUTORIALS, ...SELLER_TUTORIALS, ...BUYER_TUTORIALS };
