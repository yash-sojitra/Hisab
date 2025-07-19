import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/react-router"
import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"

function App() {
  return (
    <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
        path="/"
        element={
          <>
            <SignedIn>
              <HomePage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  )
}

export default App
