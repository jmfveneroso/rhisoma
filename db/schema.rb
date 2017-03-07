# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170303191240) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "edges", force: :cascade do |t|
    t.integer "source_id", null: false
    t.integer "target_id", null: false
    t.string  "category"
  end

  create_table "nodes", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "title"
    t.string   "type"
    t.boolean  "active"
    t.boolean  "hidden"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.integer  "territory_id",        null: false
    t.text     "description"
    t.datetime "start_date"
    t.datetime "end_date"
    t.text     "text"
    t.string   "link"
    t.float    "x"
    t.float    "y"
    t.float    "vx"
    t.float    "vy"
    t.float    "fx"
    t.float    "fy"
    t.integer  "target_territory_id"
    t.integer  "styling_group_id"
    t.boolean  "collapse"
    t.boolean  "standby"
    t.datetime "complete_date"
    t.index ["user_id"], name: "index_nodes_on_user_id", using: :btree
  end

  create_table "styling_groups", force: :cascade do |t|
    t.integer "user_id"
    t.string  "color"
    t.string  "name"
    t.index ["user_id"], name: "index_styling_groups_on_user_id", using: :btree
  end

  create_table "territories", force: :cascade do |t|
    t.integer  "user_id",                    null: false
    t.string   "name"
    t.boolean  "public",     default: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "template"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "password_digest"
    t.string   "remember_digest"
    t.boolean  "admin",               default: false
    t.string   "activation_digest"
    t.boolean  "activated",           default: false
    t.datetime "activated_at"
    t.string   "reset_digest"
    t.datetime "reset_sent_at"
    t.string   "name"
    t.string   "email_reset_digest"
    t.string   "new_email"
    t.datetime "email_reset_sent_at"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
  end

  add_foreign_key "nodes", "users"
  add_foreign_key "styling_groups", "users"
end
