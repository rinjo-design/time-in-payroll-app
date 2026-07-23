import bcrypt from 'bcryptjs';
const password=process.argv[2] ?? '2001'; console.log(await bcrypt.hash(password,12));
