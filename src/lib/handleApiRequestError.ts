import { ZodError } from "zod";


export function handleApiRequestError(error: any) {

    if (error instanceof ZodError) {
        toast.error(error.issues[0].message);
    } else {
        toast.error(error.message);
    }
}

