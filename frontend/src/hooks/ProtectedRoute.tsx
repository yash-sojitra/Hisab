import Layout from "@/layout";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
    title: string;
}

//Protected Route component that redirects non authenticated user to signin page
export default function ProtectedRoute({ children, title }: ProtectedRouteProps) {
    return (
        <>
            <SignedIn>
                <Layout title={title}>
                    {children}
                </Layout>
            </SignedIn>
            <SignedOut>
                <Navigate to="/sign-in" />
            </SignedOut>
        </>
    )
}
