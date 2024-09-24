import { SalableStatus } from './salable-status';
import { StatusType } from '../../../enums/status-type';

describe('salable-status', () => {
  let salableStatus: SalableStatus;

  beforeEach(() => {
    salableStatus = new SalableStatus();
  });

  describe('getSvg method', () => {
    it('should return success SVG when statusType is SUCCESS', () => {
      salableStatus.statusType = StatusType.SUCCESS;
      const svg = salableStatus.getSvg();
      expect(svg['$attrs$'].id).toBe('success-svg');
    });

    it('should return warning SVG when statusType is WARNING', () => {
      salableStatus.statusType = StatusType.WARNING;
      const svg = salableStatus.getSvg();
      expect(svg['$attrs$'].id).toBe('warning-svg');
    });

    it('should return error SVG when statusType is ERROR', () => {
      salableStatus.statusType = StatusType.ERROR;
      const svg = salableStatus.getSvg();
      expect(svg['$attrs$'].id).toBe('error-svg');
    });
  });

  describe('getColour method', () => {
    it('should return correct classes when statusType is SUCCESS', () => {
      salableStatus.statusType = StatusType.SUCCESS;
      const classes = salableStatus.getColour();
      expect(classes).toBe('bg-green-100 text-green-800 dark:bg-green-900');
    });

    it('should return correct classes when statusType is WARNING', () => {
      salableStatus.statusType = StatusType.WARNING;
      const classes = salableStatus.getColour();
      expect(classes).toBe('bg-orange-100 text-orange-800 dark:bg-orange-900');
    });

    it('should return correct classes when statusType is ERROR', () => {
      salableStatus.statusType = StatusType.ERROR;
      const classes = salableStatus.getColour();
      expect(classes).toBe('bg-red-100 text-red-800 dark:bg-red-900');
    });
  });
});
