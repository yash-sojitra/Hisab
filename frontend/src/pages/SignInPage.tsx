import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
        <SignIn path="/sign-in" routing="path" signUpUrl="sign-up"/>
    </div>
  )
}