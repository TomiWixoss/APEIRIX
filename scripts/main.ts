/**
 * Better SB - Main Entry Point
 * "Don't play Skyblock, play this!"
 */

import { DisplayHandler } from './systems/shared/processing/DisplayHandler';

// Initialize immediately when script loads
console.warn('[Better SB] Initializing addon...');

// Initialize display system (QoL: show block names on look)
DisplayHandler.initialize();

console.warn('[Better SB] Addon initialized successfully!');
