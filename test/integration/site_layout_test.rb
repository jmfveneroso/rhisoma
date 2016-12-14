require 'test_helper'

class SiteLayoutTest < ActionDispatch::IntegrationTest
  test "layout links" do
    get root_path
    assert_template 'static_pages/home'
    assert_select "a[href=?]", signup_path, count: 1
  end
  # test "the truth" do
  #   assert true
  # end
end
