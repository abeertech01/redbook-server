import { TryCatch } from "../middlewares/error"
import prisma from "../lib/prismadb"
import { isEmail, sendToken } from "../utils/features"
import { compare, hash } from "bcrypt"
import { ErrorHandler } from "../utils/utility"
import { NextFunction, Request, Response } from "express"
import { IRequest, SearchedUser, User } from "../utils/types"
import { getAllChats } from "../lib/helpers"

const registerUser = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
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
  }
)

const loginUser = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { userAddress, password } = req.body
    let record

    if (req.cookies["redbook-token"])
      return next(new ErrorHandler("You are already logged in", 400))

    const isEmailAddress: boolean = isEmail(userAddress)

    if (isEmailAddress) {
      record = await prisma.user.findUnique({
        where: { email: userAddress },
      })
    } else {
      record = await prisma.user.findUnique({
        where: { username: userAddress },
      })
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
  }
)

const logoutUser = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    res.clearCookie("redbook-token")
    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    })
  }
)

const userProfile = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.id },
    })

    res.status(200).json({
      success: true,
      user: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    })
  }
)

const searchUser = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { name = "" } = req.query

    const myChats = await getAllChats(prisma, req)

    let allUsers: SearchedUser[]
    let allUsersFromMyChats: User[]

    //  extracting All Users from my chats means friends or people I have chatted with
    if (myChats.length > 0) {
      allUsersFromMyChats = myChats.flatMap((chat) => chat.members)

      // Finding all users except me and my friends
      allUsers = await prisma.user.findMany({
        where: {
          NOT: [...allUsersFromMyChats],
          name: {
            contains: name as string,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          username: true,
        },
      })
    }

    allUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: req.id,
        },
        name: {
          contains: name as string,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    })

    res.status(200).json({
      success: true,
      users: allUsers,
    })
  }
)

export { registerUser, loginUser, logoutUser, userProfile, searchUser }
