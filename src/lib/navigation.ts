import { SectorId, ModuleId } from '../../types';

export const navigateTo = (sector?: SectorId, module?: ModuleId, subItem?: string | null) => {
  window.dispatchEvent(new CustomEvent('vms-navigate', { 
    detail: { sector, module, subItem } 
  }));
};
