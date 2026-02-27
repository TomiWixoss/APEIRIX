/**
 * Machine State - Quản lý trạng thái của processing machines
 */

import { Vector3 } from '@minecraft/server';

export interface MachineState {
  dimension: string;
  location: Vector3;
  machineType: string; // 'compressor', 'brass_sifter', 'ore_crusher_mk1', etc.
  isProcessing: boolean;
  ticksRemaining: number;
  inputItem: string;
  outputItem: string;
  lastInteractionTick: number;
}

export class MachineStateManager {
  private static states: Map<string, MachineState> = new Map();

  static getLocationKey(dimensionId: string, location: Vector3): string {
    return `${dimensionId}:${Math.floor(location.x)},${Math.floor(location.y)},${Math.floor(location.z)}`;
  }

  static add(dimensionId: string, location: Vector3, machineType: string): void {
    const key = this.getLocationKey(dimensionId, location);
    this.states.set(key, {
      dimension: dimensionId,
      location: location,
      machineType: machineType,
      isProcessing: false,
      ticksRemaining: 0,
      inputItem: '',
      outputItem: '',
      lastInteractionTick: 0
    });
  }

  static remove(dimensionId: string, location: Vector3): void {
    const key = this.getLocationKey(dimensionId, location);
    this.states.delete(key);
  }

  static get(dimensionId: string, location: Vector3): MachineState | undefined {
    const key = this.getLocationKey(dimensionId, location);
    return this.states.get(key);
  }

  static getAll(): Map<string, MachineState> {
    return this.states;
  }
}
