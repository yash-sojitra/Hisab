import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import { useApiClient } from "./api/apiClient"
import { useTransactionStore } from "./store/useTransactionStore"
import { useEffect } from "react"
import { useCategoryStore } from "./store/useCategoryStore"
import ProtectedRoute from "./hooks/ProtectedRoute"
import TransactionsPage from "./pages/TransactionsPage"

function App() {
  const apiClient = useApiClient();
  const { setApiClient } = useTransactionStore();
  const { setApiClient: setCategoryApiClient } = useCategoryStore();
  
  //injecting apiCLient on app startup
  useEffect(() => {
    setApiClient(apiClient);
  }, [apiClient, setApiClient]);

  useEffect(() => {
    setCategoryApiClient(apiClient);
  }, [apiClient, setCategoryApiClient]);

  return (
    <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

          <Route
          path="/"
          element={
            <ProtectedRoute title="Dashboard">
                <HomePage />
            </ProtectedRoute>
          }/>

          <Route
          path="/transactions"
          element={
            <ProtectedRoute title="Transactions">
                <TransactionsPage />
            </ProtectedRoute>
          }/>


    </Routes>
  )
}

export default App
