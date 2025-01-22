import colors from "./colors";

export const successMessage = (message: unknown) => {
  return `${colors.fg.green}${message}${colors.reset}`;
};

export const errorMessage = (message: unknown) => {
  return `${colors.fg.red}${message}${colors.reset}`;
};

export const primaryMessage = (message: unknown) => {
  return `${colors.fg.blue}${message}${colors.reset}`;
};

export const warningMessage = (message: unknown) => {
  return `${colors.fg.yellow}${message}${colors.reset}`;
};

export const infoMessage = (message: unknown) => {
  return `${colors.fg.cyan}${message}${colors.reset}`;
};
