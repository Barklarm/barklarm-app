export const storage = (electron: any) => ({
  saveObservers: (observables: any[]): void => {
    electron.store.set('observables', observables);
    electron.app.refreshObservers();
  },
  getObservers: (): any[] => {
    return electron.store.get('observables') || [];
  },
});
