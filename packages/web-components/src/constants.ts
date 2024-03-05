let apiUrl = ''
let stripePublicKey = ''
let stripePublicKeyTestmode = ''
try {
    apiUrl = process.env.API_URL;
    stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
    stripePublicKeyTestmode = process.env.STRIPE_PUBLIC_KEY_TESTMODE;
} catch (error) {
    throw new Error("Setup your environment variables")
}

if (!Boolean(apiUrl) || !Boolean(stripePublicKey) || !Boolean(stripePublicKeyTestmode)) throw new Error("One or more of your environment variables is an empty string")

export {
    apiUrl,
    stripePublicKey,
    stripePublicKeyTestmode
}
