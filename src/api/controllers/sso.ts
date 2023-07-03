import { Controller, Get, PlatformContext } from "@tsed/common"
import { BaseController } from "@utils/classes"
import axios from "axios";
import DiscordOAuth2 from 'discord-oauth2'

@Controller('/sso')
export class SsoController extends BaseController {

    @Get()
    sso(req: any) {
        const code = req?.event?.request?.query;

        console.log(Object.keys(req?.event?.request), req?.event?.request?.query);
// https://discord.com/developers/docs/topics/oauth2
        // axios.get('https://discord.com/api/users/@me', {
        //     // headers: {
        //     //     authorization: `${tokenType} ${process.env.BOT_TOKEN}`,
        //     // },
        // })
        
        // if (!accessToken) {
        // 	return (document.getElementById('login').style.display = 'block');
        // }

        // 	fetch('https://discord.com/api/users/@me', {
        // 		headers: {
        // 			authorization: `${tokenType} ${accessToken}`,
        // 		},
        // 	})
        // 		.then(result => result.json())
        // 		.then(response => {
        // 			const { username, discriminator } = response;
        // 			document.getElementById('info').innerText += ` ${username}#${discriminator}`;
        // 		})
        // 		.catch(console.error);
        return code;
    }
}
