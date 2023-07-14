'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20230714000209 extends Migration {

  async up() {
    this.addSql('create table "channel" ("channel_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "last_interact" timestamptz(0) not null, "bot_chat" boolean not null default false, "mode" varchar(255) not null default \'chat\', "prompt" varchar(255) null, "data" jsonb null, constraint "channel_pkey" primary key ("channel_id"));');

    this.addSql('create table "data" ("key" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "value" varchar(255) not null default \'\', constraint "data_pkey" primary key ("key"));');

    this.addSql('create table "guild" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "prefix" varchar(255) null, "deleted" boolean not null default false, "last_interact" timestamptz(0) not null, constraint "guild_pkey" primary key ("id"));');

    this.addSql('create table "image" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_name" varchar(255) not null, "base_path" varchar(255) not null default \'\', "url" varchar(255) not null, "size" int not null, "tags" text[] not null, "hash" varchar(255) not null, "delete_hash" varchar(255) not null);');

    this.addSql('create table "pastebin" ("id" varchar(255) not null, "edit_code" varchar(255) not null, "lifetime" int not null default -1, "created_at" timestamptz(0) not null, constraint "pastebin_pkey" primary key ("id"));');

    this.addSql('create table "player" ("user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "last_interact" timestamptz(0) not null, "data" jsonb null, constraint "player_pkey" primary key ("user_id"));');

    this.addSql('create table "stat" ("id" serial primary key, "type" varchar(255) not null, "value" varchar(255) not null default \'\', "additional_data" jsonb null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "thread" ("thread_id" varchar(255) not null, "message_id" varchar(255) not null, "channel_id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "last_interact" timestamptz(0) not null, "bot_chat" boolean not null default false, "mode" varchar(255) not null default \'chat\', "prompt" varchar(255) null, "data" jsonb null, constraint "thread_pkey" primary key ("thread_id", "message_id", "channel_id"));');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "last_interact" timestamptz(0) not null, constraint "user_pkey" primary key ("id"));');
  }

}
exports.Migration20230714000209 = Migration20230714000209;
