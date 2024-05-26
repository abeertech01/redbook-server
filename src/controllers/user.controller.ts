import { TryCatch } from "../middlewares/error"
import prisma from "../lib/prismadb"
import { isEmail, sendToken } from "../utils/features"
import { compare, hash } from "bcrypt"
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

  sendToken(
    res,
    {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    201,
    "User registered!"
  )
})

const loginUser = TryCatch(async (req, res, next) => {
  const { userAddress, password } = req.body
  let record

  const isEmailAddress: boolean = isEmail(userAddress)

  if (isEmailAddress) {
    record = await prisma.user.findUnique({
      where: { email: userAddress },
    })
  } else {
    record = await prisma.user.findUnique({ where: { username: userAddress } })
  }

  if (!record) return next(new ErrorHandler("User not found", 404))

  const passwordMatched = await compare(password, record.password)

  if (!passwordMatched)
    return next(new ErrorHandler("Invalid credentials", 401))

  sendToken(
    res,
    {
      id: record.id,
      name: record.name,
      username: record.username,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    },
    200,
    "User logged in!"
  )
})

export { registerUser, loginUser }
