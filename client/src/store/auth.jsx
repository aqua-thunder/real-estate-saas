import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // Logged-in user (single object)
    const [user, setUser] = useState(null);

    // All users (Super Admin page)
    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(true)
    const [location, setLocation] = useState([])
    const [owners, setOwners] = useState([])


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

    // Get logged-in user data
    const userAuthentication = async () => {
        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:7000/api/auth/user", {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.userData);
            }

            setIsLoading(false);
        } catch (error) {
            console.log("Error fetching user data");
            setIsLoading(false);
        }
    };


    // Get all locations
    const getLocation = async () => {
        try {
            const response = await fetch("http://localhost:7000/api/admin/locations", {
                method: "GET",
                headers: {
                    Authorization: authorizationToken
                },
            });
            if (response.ok) {
                const data = await response.json();
                setLocation(data.msg);
            } else if (response.status === 403) {
                console.log("Access denied: You don't have permission to view locations");
                setLocation([]);
            }
        } catch (error) {
            console.log("Error fetching locations:", error);
            setLocation([]);
        }
    }

    // Get all owners
    const getOwners = async () => {
        try {
            const response = await fetch("http://localhost:7000/api/admin/getOwners", {
                method: "GET",
                headers: {
                    Authorization: authorizationToken
                },
            });
            if (response.ok) {
                const data = await response.json();
                setOwners(data.msg);
            } else if (response.status === 403) {
                console.log("Access denied: You don't have permission to view owners");
                setOwners([]);
            }
        } catch (error) {
            console.log("Error fetching owners:", error);
            setOwners([]);
        }
    }

    // Get all users
    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:7000/api/auth/all-users", {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.msg);
            } else if (response.status === 403) {
                console.log("Access denied: You don't have permission to view users");
                setUsers([]);
            }
        } catch (error) {
            console.log("Error fetching users:", error);
            setUsers([]);
        }
    };


    useEffect(() => {
        if (token) {
            userAuthentication();
        } else {
            setUser(null);
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token && user) {
            // Only fetch admin data if user is SUPER_ADMIN
            if (user.role === "SUPER_ADMIN") {
                getLocation();
                getOwners();
                getUsers();
            }
        }
    }, [token, user])

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, isLoading, user, users, setUser, location, owners, storetokenInLS, logoutUser }}>
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
