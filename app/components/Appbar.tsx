"use client"

import { signIn, signOut, useSession } from "next-auth/react";

export function Appbar() {
    const session = useSession();

    return (
        <div className="flex justify-between items-center p-4">
            <div>
                Jukebox.Social
            </div>
            <div>
                {session.data?.user && (
                    <button 
                        className="m-2 p-2 bg-blue-400 text-white rounded" 
                        onClick={() => signOut()}
                    >
                        Logout
                    </button>
                )}
                {!session.data?.user && (
                    <button 
                        className="m-2 p-2 bg-blue-400 text-white rounded" 
                        onClick={() => signIn()}
                    >
                        Sign in
                    </button>
                )}
            </div>
        </div>
    );
}