/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
//(window as any).global = window;
//declare var global: any;
declare var Auth0Lock: any;
