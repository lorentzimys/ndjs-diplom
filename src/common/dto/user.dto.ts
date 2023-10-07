export class UserDTO implements Omit<IUser, 'passwordHash'> {
  id: string;
  name: string;
  email: string;
  contactPhone: string;
  role: UserRole;
}
