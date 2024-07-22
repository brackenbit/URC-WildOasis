/*
    Wrapper to add a max toasts limit to react-hot-toast
    adapted from code by softmarshmallow:
    https://github.com/timolins/react-hot-toast/issues/31#issuecomment-2084653008
*/

import { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

function useMaxToasts(max) {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= max) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
    }, [toasts, max]);
}

export default function ToasterWithMax({ max = 10, ...props }) {
    useMaxToasts(max);

    return <Toaster {...props} />;
}
