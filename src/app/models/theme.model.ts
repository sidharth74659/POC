export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    backgroundColor: string;
    textColor: string;
    headingColor: string;
    errorColor: string;
    successColor: string;
    borderColor: string;
  };
} 