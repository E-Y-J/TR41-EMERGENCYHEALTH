// Type definitions for mailcheck
declare module "mailcheck" {
  type Suggestion = {
    address: string;
    domain: string;
    full: string;
  };

  const Mailcheck: {
    run: (options: {
      email: string;
      suggested: (suggestion: Suggestion) => void;
      empty?: () => void;
    }) => void;
  };

  export default Mailcheck;
}