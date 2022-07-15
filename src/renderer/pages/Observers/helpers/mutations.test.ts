import { faker } from '@faker-js/faker';
import { mutations } from './mutations';

describe('mutations', () => {
  const initialObservables = [
    { some: faker.datatype.uuid() },
    { some: faker.datatype.uuid() },
    { some: faker.datatype.uuid() },
  ];
  const setObservablesMock = jest.fn();
  let mutationFunctions: any;

  beforeEach(() => {
    setObservablesMock.mockReset();
    mutationFunctions = mutations(initialObservables, setObservablesMock);
  });
  describe('addObserver', () => {
    it('should add the new value to the existing collection', () => {
      const newObservable = { some: faker.datatype.uuid() };
      mutationFunctions.addObserver(newObservable);
      expect(setObservablesMock).toBeCalledWith([...initialObservables, newObservable]);
    });
  });
  describe('removeObserver', () => {
    it('should remove the value at the index', () => {
      mutationFunctions.removeObserver(1);
      expect(setObservablesMock).toBeCalledWith([initialObservables[0], initialObservables[2]]);
    });
  });
  describe('updateObserver', () => {
    it('should update the value of the field at the index', () => {
      const expectNewValue = faker.datatype.uuid();
      mutationFunctions.updateObserver(`some`, 1, expectNewValue);
      expect(setObservablesMock).toBeCalledWith([
        initialObservables[0],
        { some: expectNewValue },
        initialObservables[2],
      ]);
    });
  });
  describe('parseDataransfer', () => {
    it('should not call set observable if no text data type', () => {
      const dataTransfer = {
        types: [faker.datatype.uuid()],
      };
      mutationFunctions.parseDataransfer(dataTransfer);
      expect(setObservablesMock).not.toBeCalled();
    });
    it('should not call set observable if text data type but not recognizable url', () => {
      const dataTransfer = {
        types: ['text'],
        getData: () => faker.internet.url(),
      };
      mutationFunctions.parseDataransfer(dataTransfer);
      expect(setObservablesMock).not.toBeCalled();
    });
    it('should call set observable if text data type and recognizable url', () => {
      const dataTransfer = {
        types: ['text'],
        getData: () => 'https://app.datadoghq.eu/monitors/4005341',
      };
      mutationFunctions.parseDataransfer(dataTransfer);
      expect(setObservablesMock).toBeCalledWith([
        ...initialObservables,
        { monitorId: '4005341', site: 'datadoghq.eu', type: 'datadogMonitor' },
      ]);
    });
  });
});
