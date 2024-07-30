export interface Check {
  test: () => boolean;
  setup?: () => void;
  errorMsg: string;
}
