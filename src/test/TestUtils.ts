export async function delay(mills: number): Promise<any> {
    return await new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, mills)
    });
}

