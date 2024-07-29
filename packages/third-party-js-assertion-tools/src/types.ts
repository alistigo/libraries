export interface Check {
  test: () => void;
  setup?: () => void;
  errorMsg: string;
}
