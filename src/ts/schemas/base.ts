import { ppStripOfNonNumeric, stripOfNonNumeric } from '../utils.js';
import { z } from '../zod-config.js';

export const baseText = z.string().trim().min(2).max(100);
export const basePhone = z.preprocess(ppStripOfNonNumeric, z.string().trim().min(7).max(20).transform(stripOfNonNumeric));
export const baseInd = z.coerce.number().min(1).max(999);
export const baseEmail = z.string().email().trim().max(100);
export const baseMsg = z.string().trim().max(4000).nullish();
export const baseAccepted = z.literal('on');
export const baseBool = z.preprocess(val => val === 'on', z.boolean());
