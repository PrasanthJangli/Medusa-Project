import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261031124004 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "storefront_theme" ("id" text not null, "name" text not null, "preset" text check ("preset" in ('fashion', 'electronics', 'furniture', 'beauty', 'custom')) not null default 'fashion', "settings" jsonb not null, "status" text check ("status" in ('draft', 'published', 'archived')) not null default 'draft', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "storefront_theme_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_storefront_theme_deleted_at" ON "storefront_theme" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "storefront_theme" cascade;`);
  }

}
