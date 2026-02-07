export default defineEventHandler(async (event) => {

    const email     = useRuntimeConfig().secret_API_AUTH_EMAIL
    const password  = useRuntimeConfig().secret_API_AUTH_PASSWORD

    const authHeader = Buffer.from(`${email}:${password}`).toString('base64')

    const body = await readBody(event)

    const dataApi = await $fetch(`${useRuntimeConfig().public.apiUrl}/api/query`, {
        lazy: true,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`
        },
        body,
        timeout: 5_000,
    })

    return dataApi
})
