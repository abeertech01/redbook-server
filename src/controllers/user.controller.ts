import { TryCatch } from "../middlewares/error"
import prisma from "../lib/prismadb"
import { sendToken } from "../utils/features"
import { hash } from "bcrypt"
import { ErrorHandler } from "../utils/utility"

const registerUser = TryCatch(async (req, res, next) => {
  const { name, username, email, password } = req.body

  const hashedPassword = await hash(password, 13)

  const record = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (record) {
    return next(new ErrorHandler("User already exists", 400))
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
    },
  })

  sendToken(res, user, 201, "User registered!")
})

export { registerUser }
