'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20230708081618 extends Migration {

  async up() {
    this.addSql('create table `channel` (`channel_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `last_interact` datetime not null, `bot_chat` integer not null default false, `mode` text not null default \'chat\', `prompt` text null, `data` json null, primary key (`channel_id`));');

    this.addSql('create table `player` (`user_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `last_interact` datetime not null, `data` json null, primary key (`user_id`));');

    this.addSql('create table `thread` (`thread_id` text not null, `message_id` text not null, `channel_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `last_interact` datetime not null, `bot_chat` integer not null default false, `mode` text not null default \'chat\', `prompt` text null, `data` json null, primary key (`thread_id`, `message_id`, `channel_id`));');
  }

}
exports.Migration20230708081618 = Migration20230708081618;
