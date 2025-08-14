export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone_1?: number;
  phone_2?: number;
  dni?: number;
}