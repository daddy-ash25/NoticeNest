import { Show, RedirectToSignIn } from "@clerk/react";
import { Outlet } from "react-router-dom";

function ProtectedApp() {
    return (
        <Show
            when="signed-in"
            fallback={<RedirectToSignIn />}
        >
            <Outlet />
        </Show>
    );
}

export default ProtectedApp;