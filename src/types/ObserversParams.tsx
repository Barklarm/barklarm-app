export type ObserversParams = {
  observables: any[];
  add: (value: any) => void;
  remove: (index: number) => void;
  update: (fieldName: string, index: number, value: any) => void;
};
