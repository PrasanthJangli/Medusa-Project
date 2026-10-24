import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261013125424 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_display_template" ("id" text not null, "template" text check ("template" in ('classic-grid', 'premium-card', 'list-view', 'image-focused')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_display_template_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_display_template_deleted_at" ON "product_display_template" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_display_template" cascade;`);
  }

}
