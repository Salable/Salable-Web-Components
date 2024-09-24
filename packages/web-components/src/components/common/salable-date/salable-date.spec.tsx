import { SalableDate } from './salable-date';
import format from 'date-fns/format';

describe('SalableDate', () => {
  let salableDate: SalableDate;
  let getBoundingClientRectSpy: jest.SpyInstance;

  beforeEach(() => {
    salableDate = new SalableDate();
    getBoundingClientRectSpy = jest.spyOn(salableDate.hostElement, 'getBoundingClientRect');
  });

  afterEach(() => {
    getBoundingClientRectSpy.mockRestore();
  });

  it('should create', () => {
    expect(salableDate).toBeTruthy();
  });

  it('should initialize with isLongFormat as false', () => {
    expect(salableDate.isLongFormat).toBeFalsy();
  });

  it('should update isLongFormat based on hostElement width', () => {
    getBoundingClientRectSpy.mockReturnValue({ width: 150 });
    salableDate.updateFormat();
    expect(salableDate.isLongFormat).toBeFalsy();

    getBoundingClientRectSpy.mockReturnValue({ width: 250 });
    salableDate.updateFormat();
    expect(salableDate.isLongFormat).toBeTruthy();
  });

  it('should provide the correct date format', () => {
    salableDate.isLongFormat = false;
    salableDate.date = '2023-04-30';
    expect(salableDate.getDateFormat()).toEqual(format(new Date('2023-04-30'), 'dd-MM-Y'));

    salableDate.isLongFormat = true;
    expect(salableDate.getDateFormat()).toEqual(format(new Date('2023-04-30'), 'dd MMMM yyyy'));
  });
});
