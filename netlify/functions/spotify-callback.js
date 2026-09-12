

export default async (request) => {

    const url = new URL(request.url);
    const code  = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if(error){
        return new Response(`Codigo autenticacion de spotify: ${error}`, {
            status: 400
        });
    }

    if(!code){
        return new Response("No hay codigo de error", {
            status: 400
        });
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const redirectUri = `${process.env.URL}/.netlify/functions/spotify-callback`;

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri
            })
        }
    );

    const data = await response.json();

    if(!response.ok){
        return new Response(
            JSON.stringify(data, null, 2),
            {
                status: response.status,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }

    return new Response(
        JSON.stringify({
            message: "Spotify authorization successful!",
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in
        }, null, 2),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

}