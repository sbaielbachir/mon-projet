export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  is_staff?: boolean;
  [key: string]: unknown;
}