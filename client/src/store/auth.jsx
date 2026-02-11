import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState('')
    const [isLoading, setIsLoading] = useState(true)


    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });


    const authorizationToken = `Bearer ${token}`


    const storetokenInLS = (serverToken) => {
        setToken(serverToken);
        localStorage.setItem("token", serverToken);
    };

    const isLoggedIn = !!token;
    console.log("isLoggedIn", isLoggedIn)


    const logoutUser = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    const userAuthentication = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`http://localhost:7000/api/auth/user`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('user data', data.userData);
                setUser(data.userData);
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log("Error fetching user data");
        }

    }


    useEffect(() => {
        if (token) {
            userAuthentication();
        } else {
            setUser("");
            setIsLoading(false);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, user, storetokenInLS, logoutUser, }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return authContextValue;
};
