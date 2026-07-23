declare module 'bcryptjs' {
  const bcrypt: {
    hash(value: string, saltOrRounds: number): Promise<string>;
    compare(value: string, encrypted: string): Promise<boolean>;
  };
  export default bcrypt;
}
