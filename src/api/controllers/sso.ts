import { Context, Controller, Get, PlatformContext } from "@tsed/common"
import { BaseController } from "@utils/classes"
import DiscordOAuth2 from 'discord-oauth2'

@Controller('/sso')
export class SsoController extends BaseController {

    @Get('/discord')
    async callback(@Context() ctx: Context) {
        // if request is from a known source, allow that origin
        // TODO: allow more sources as needed
        if ((ctx.request.headers.origin === `${process.env.WEBSITE_URL}`)) {
            ctx.response.setHeaders({
                'Access-Control-Allow-Origin': process.env.WEBSITE_URL,
            });
        }

        const { code } = ctx.request?.query;
        if (!code) {
            return 'No code provided';
        }

        
        const oauth = new DiscordOAuth2({
            clientId: `${process.env.BOT_APP_ID}`,
            clientSecret: `${process.env.BOT_SECRET}`,
            redirectUri: process.env.DASHBOARD_URL,
        });

        const auth = await oauth.tokenRequest({
            scope: ['identify'],
            code,
            grantType: 'authorization_code',
        }).catch(err => console.error(JSON.stringify(err?.response, null, 2)));
        
        const user = await oauth.getUser(`${auth?.access_token}`)
            .catch(err => console.error(JSON.stringify(err?.response, null, 2)));

        const data = {
            sso: 'discord',
            auth, // needed for further auth requests
            user,
        };

        ctx.response.contentType("application/json");
        return data;
    }
}
