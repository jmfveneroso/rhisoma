require 'test_helper'

class StylingGroupTest < ActiveSupport::TestCase
  def setup
    @user = users(:basic_user)
    @sg = StylingGroup.new(name: 'X', color: '#ff0000', user_id: @user.id)
  end

  test "styling group should be valid" do
    assert @sg.valid?
  end

  test "name should be present" do
    @sg.name = "     "
    assert_not @sg.valid?
  end

  test "color should be valid" do
    @sg.color = "     "
    assert_not @sg.valid?

    @sg.color = '#f00d'
    assert_not @sg.valid?
  end

  test "user should be valid" do
    @sg.user_id = -1
    assert_not @sg.valid?
  end
end
