import { CreateUsernameResponse, GraphQLContext } from "../../../utils/types";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { GraphQLError } from "graphql";


/////////////// Mutation ///////////////
// export const createUsername = async (_: any, args: { username: string, email: string, password: string, token: string }, context: GraphQLContext): Promise<CreateUsernameResponse> => {
//   const { prisma } = context;
//   const { username, email, password, token } = args;

//   try {
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (existingUser && password.length > 8) {
//       return {
//         error: "User already exists or password invalid",
//       };
//     }

//     const pass = await bcrypt(password, 5)



//     const token = jwt.sign({ email }, '123', { expiresIn: "8h" })

//     const usuario = await prisma.user.create({
//       data: {
//         username,
//         email,
//         passwordHash: pass,
//         token,

//       }
//     });



//     return {
//       id: usuario.id,
//       email: usuario.email,
//     };
//   } catch (err: any) {
//     console.log("CreateUsername error", err);
//     return {
//       error: err?.message,
//     };
//   }
// },


// export const login = async (_: any, args: { username: string, email: string, password: string, token: string }, context: GraphQLContext): Promise<CreateUsernameResponse> => {
//   const { prisma } = context;
//   const { username, email, password, token } = args;

//   try {
//     const usuario = await prisma.user.findOne({
//       where: {
//         email,
//       },
//     });

//     const passCorrect = usuario === null ? false : await bcrypt.compare(password, usuario.passwordHash)


//     if (!usuario && !passCorrect) {
//       throw new GraphQLError(
//         "User not exists or password invalid",
//       )
//     }

//     const userToken = {
//       id: usuario.id,
//       email: usuario.email
//     }

//     const token = jwt.sign(userToken, '123', { expiresIn: "8h" })



//     return {
//       username: email.split('@')[0],
//       token
//     };
//   } catch (err: any) {
//     console.log("CreateUsername error", err);
//     return {
//       error: err?.message,
//     };
//   }
// };


export const RegisterUser = async (_: any, { registerInput }, context: GraphQLContext) => {
  const { prisma } = context;
  const { username, email, password } = registerInput;

  try {
    const usuario = await prisma.user.findUnique({
      where: {
        email,
      },
    });



    if (usuario) {
      throw new GraphQLError(
        `User is already registered with the email ==> ${email}`
      )
    }

    const passHash = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: passHash,
        token: ''
      }
    })



    const userToken = {
      id: newUser.id,
      email: newUser.email
    }

    const token = jwt.sign(userToken, '123', { expiresIn: "8h" })

    await prisma.user.update({
      where: {
        id: newUser.id
      },
      data: {
        token,
      }
    })

    return {
      ...newUser,
      token: token,
    };
  } catch (err: any) {
    console.log("CreateUsername error", err);
    return {
      error: err?.message,
    };
  }
};



export const LoginUser = async (_: any, { loginInput }, context: GraphQLContext) => {
  const { prisma } = context;
  const { email, password } = loginInput;


  try {

    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    const verifyPass = await bcrypt.compare(password, user.passwordHash)

    if (user && verifyPass) {
      const userToken = {
        id: user.id,
        email: user.email
      }
      const token = jwt.sign(userToken, '123', { expiresIn: "8h" })

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          token,
        }
      })

      return {
        ...user,
        token: token
      }
    } else {
      throw new GraphQLError("Incorrect password or user");
    }

  } catch (err: any) {
    console.log("CreateUsername error", err);
    return {
      error: err?.message,
    };
  }
};
