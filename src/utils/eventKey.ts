import type { EventBusKey } from '@vueuse/core';

export const fooKey: EventBusKey<{ name: string }> = Symbol('symbol-key');
