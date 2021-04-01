---
title: My First post!
date: 2021-03-31T13:35:34.979Z
---

> This is not a how to build post, but me writing down what and how I made stuff. A learning journal if you may.

## The Stack

* Next.js
* React Query
* TailwindCSS
* NextAuth
* MongoDB

## Design
First of all I almost always start my projects with a design. I'm not a designer but a simple prototype helps me focus. Usually made In [Figma](https://www.figma.com/).

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qrxdtj2gar8o5d1pzrzj.PNG)

> The design is obviously inspired by twitter. Made this in Figma so that I can have a reference to follow in code as close as I can. 

## Setup
In this project I want to get my hands dirty with Next.js

Luckily Next.js already have a hefty amount of templates.
So I'm gonna use their with-typescript to save some time, even though adding typescript to it is pretty easy 

### Initializing the project 
`npx create-next-app --example with-typescript howler`

**Typesript**
Now I'll just modify my tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/api/*": ["/pages/api/*"],
    
    },
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}

```
I find it more helpful when learning Typescript to turn on strict mode `"strict": true`. This forces you to give everything typing's.

**Compiler Options** this is just my preference to get cleaner looking imports. 
Instead of having to type this:
```js
import Example from `../components/Example`

//or worst case.
import Example from `../../../components/Example`
```
You get this! No matter where you need it.
```js
import Example from `@/components/Example`
```


**Tailwind CSS** 
A bit annoying at first, but fell in love with this CSS utility based framework.

```
npm install -D @tailwindcss/jit tailwindcss@latest postcss@latest autoprefixer@latest
``` 
```js
// tailwind.config.js
module.exports = {
 purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```
Post Css Config
```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/jit': {},
    autoprefixer: {},
  }
}
```


## Authentication 

Implementing Open authentication in Next.js using NextAuth.js.

I'll just link their docs, It's well written!
[NextAuth Docs](https://next-auth.js.org/getting-started/example)

I will be using Github as my OAuth. Following the docs the session data you get will only include your name, email and image. But I would like to get the users github "tag" added to the session and be able to access in the frontend.

Took me awhile to figure this out but you can get the "tag" and other data from the profile parameter in the jwt callback. Like so.

*API side*
```js
import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiRequest, NextApiResponse } from 'next/types'
import User from '@/backend/model/userModel'
import dbConnect from '@/utils/dbConnect'
import { customUser } from '@/types/Model.model'

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  database: process.env.MONGODB_URI,
  session: {
    jwt: true,
  },

  callbacks: {
    //Add userTag to User
    async session(session, user: customUser) {
      const sessionUser: customUser = {
        ...session.user,
        userTag: user.userTag,
        id: user.id,
      }
      return Promise.resolve({ ...session, user: sessionUser })
    },
    async jwt(token, user: customUser, profile) {
      let response = token

      if (user?.id) {
        //Connect to DataBase
        dbConnect()
        //Get User
        let dbUser = await User.findById(user.id)
        //Add UserTag if it doesn't already exist
        if (!dbUser.userTag && profile.login) {
          dbUser.userTag = profile.login
          await dbUser.save()
          console.log('No tag')
        }

        response = {
          ...token,
          id: user.id,
          userTag: dbUser.userTag,
        }
      }

      return Promise.resolve(response)
    },
  },
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)

```

After that, getting things works in the frontend "assuming the initial setup is done" via a hook to verify and get the session and a link to "Log in" or "Log out". 

*React side*
```
import { useRouter } from 'next/router'

const Home: FC = () => {
// session - contains our user data , loading - self explanatory
  const [session, loading] = useSession()
  const route = useRouter()

// Redirects you if you are logged in
  useEffect(() => {
    session && route.push('/home')
  }, [session])

// Render if session is loading
  if (loading || session) {
    return (
      <>
        <Head>
          <title>Loading...</title>
          <link rel="icon" href="/pic1.svg" />
        </Head>
        <Loader />
      </>
    )
  }

// Render if there is no session
  return (
    <PageWarp title={'Welcome to Howler'} splash>
      <LoginPage />
    </PageWarp>
  )
}

export default Home

```

## State Management

Using React Context API for application global state to keep track 
 of states like dark mode or navigation , and used React Query to keep asynchronous data in cache. 

Debated using Redux but changed my mind when I heard about SWR and React Query. Ended up using React Query because it has a dev tool that allows you to peek on what data is being cached.

**React Query**
So this is how it goes.

Like a global state, we have to wrap it our entire app. With the `QueryClientProvider` and this prop `client={queryClient}`. Imported from "react-query". 

While I'm at it, also add the dev tools overlay 
```

import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

//React Query Connection
const queryClient = new QueryClient()

const QState: FC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default QState

```

Then we can wrap that around our global state provider.
*React Context*
```

import React, { FC, useReducer, createContext } from 'react'
import { InitialHowlState, HowlReducer, howlNav } from '@/types/Howl.model'

import QState from @/components/context/QState

// Create Context
const HowlCtx = createContext<HowlContext>({} as HowlContext)

//Reducer
const howlReducer: HowlReducer = (state, action): InitialHowlState => {
  switch (action.type) {
    //Navigation State
    case 'NAVIGATION':
      return { ...state, nav: action.payload }
    default:
      return state
  }
}

//INITIAL STATE
const initialState: InitialHowlState = {
  nav: 'home',
}

const HowlState: FC = ({ children }) => {
  const [state, dispatch] = useReducer<HowlReducer>(howlReducer, initialState)

  //ACTIONS
  const setNavigation = (nav: howlNav) => {
    dispatch({ type: 'NAVIGATION', payload: nav })
  }

  return (
    <QState >
      <HowlCtx.Provider value={{ state, setNavigation }}>
        {children}
      </HowlCtx.Provider>
    </QState >
  )
}

export default HowlState

```
```js
import { useQuery } from 'react-query'
import axios from 'axios'
import { HowlT, HowlUser } from '@/types/Howl.model'

export const fetcher = async (_url) => {
  const { data } = await axios.get(_url)
  return data
}

export const useGetHowls = (options?: UseQueryOptions<HowlT[]>) => {
  return useQuery<HowlT[]>('howls', () => fetcher('/api/howl'), options)
}

export const useGetHowlById = (_id) => {
  return useQuery<HowlT>(['howls', _id], () => fetcher(`/api/howl/${_id}`), {
    enabled: false,
  })
```