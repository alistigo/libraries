export interface Check {
  test: Function;
  setup?: Function;
  errorMsg: string;
}
