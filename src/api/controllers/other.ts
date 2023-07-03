import { Controller, Get, Redirect } from "@tsed/common"
import { BaseController } from "@utils/classes"
import DiscordOAuth2 from 'discord-oauth2'

@Controller('/')
export class OtherController extends BaseController {

    @Get()
    async status() {
        return 'API server is running'
    }
}