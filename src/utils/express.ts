export function getEmptyRes(): any {
    return {
        status: (_: any) => ({
            send: (val: any) => val
        })
    };
}
