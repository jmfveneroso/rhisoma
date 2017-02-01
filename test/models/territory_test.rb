require 'test_helper'

class TerritoryTest < ActiveSupport::TestCase
  def setup
    @user = users(:basic_user)
    @territory = Territory.new(name: "Territory Name", user_id: @user.id)
  end

  test "node group should be valid" do
    assert @territory.valid?
  end

  test "name should be present" do
    @territory.name = "     "
    assert_not @territory.valid?
  end

  test "user should be valid" do
    @territory.user_id = -1
    assert_not @territory.valid?
  end

  test "should delete node group nodes" do
    @territory_2 = territories(:one)

    assert_difference 'Node.count', -3 do
      @territory_2.destroy
    end
  end
end
