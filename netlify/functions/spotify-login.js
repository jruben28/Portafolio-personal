

export default async () => {

    const clientId = process.env.SPOTIFY_CLIENT_ID;

    const redirectUri = `${process.env.URL}/.netlify/functions/spotify-callback`;

    const scope = "user-read-currently-playing";

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        redirect_uri: redirectUri,
        scope: scope  

    });

    return Response.redirect( `https://accounts.spotify.com/authorize?${params.toString()}`,
        302);

}

