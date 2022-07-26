import bcrypt from "bcryptjs";

const userData = [
  {
    name: "Tanvir",
    email: "tanvir@gmail.com",
    password: bcrypt.hashSync("12345678"),
    isAdmin: true,
  },
  {
    name: "Miraj",
    email: "miraj@gmail.com",
    password: bcrypt.hashSync("09876543"),
    isAdmin: false,
  },
];

export default userData;
