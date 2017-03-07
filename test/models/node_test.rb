require 'test_helper'

class NodeTest < ActiveSupport::TestCase
  def setup
    @territory = territories(:one)

    @node = Node.new(title: "title", territory_id: @territory.id, 
      type: 'CategoryNode')

    @category_node = CategoryNode.new(title: "title", 
      territory_id: @territory.id)

    @task_node = TaskNode.new(title: "title", territory_id: @territory.id,
      start_date: Time.zone.now, end_date: Time.zone.now)

    @text_node = TextNode.new(title: "title", territory_id: @territory.id,
      text: 'abc')

    @link_node = LinkNode.new(title: "title", territory_id: @territory.id,
      link: 'hyperlink')
  end

  test "all should be valid" do
    assert @node.valid?
    assert @category_node.valid?
    assert @task_node.valid?
    assert @text_node.valid?
    assert @link_node.valid?
  end

  test "title should be present" do
    @node.title = "     "
    assert_not @node.valid?
  end

  test "type should be valid" do
    @node.type = "InvaliType"
    assert_not @node.valid?
  end

  # test "category nodes should not contain task, text or link fields" do
  #   @category_node.start_date = Time.zone.now
  #   assert_not @category_node.valid?
  #   @category_node.start_date = nil
  #   @category_node.end_date = Time.zone.now
  #   assert_not @category_node.valid?
  #   @category_node.end_date = nil
  #   @category_node.text = 'random text'
  #   assert_not @category_node.valid?
  #   @category_node.text = nil
  #   @category_node.link = 'google.com'
  #   assert_not @category_node.valid?
  #   @category_node.link = nil
  # end

  # test "task nodes should contain a start date" do
  #   @task_node.start_date = nil
  #   assert_not @task_node.valid?
  # end

  # test "task nodes should contain an end date" do
  #   @task_node.end_date = nil
  #   assert_not @task_node.valid?
  # end

  # test "task nodes should not contain text or link fields" do
  #   @task_node.text = 'random text'
  #   assert_not @task_node.valid?
  #   @task_node.text = nil
  #   @task_node.link = 'google.com'
  #   assert_not @task_node.valid?
  #   @task_node.link = nil
  # end

  # test "text nodes should contain a text" do
  #   @text_node.text = nil
  #   assert_not @text_node.valid?
  # end

  # test "text nodes should not contain category, task or link fields" do
  #   @text_node.description = nil
  #   @text_node.start_date = Time.zone.now
  #   assert_not @text_node.valid?
  #   @text_node.start_date = nil
  #   @text_node.end_date = Time.zone.now
  #   assert_not @text_node.valid?
  #   @text_node.end_date = nil
  #   @text_node.link = 'google.com'
  #   assert_not @text_node.valid?
  #   @text_node.link = nil
  # end

  # test "link nodes should contain a link" do
  #   @link_node.link = nil
  #   assert_not @link_node.valid?
  # end

  # test "a link should not be too long" do
  #   @link_node.link = "a" * 244 + ".example.com"
  #   assert_not @link_node.valid?
  # end

  # test "link nodes should not contain category, text or task fields" do
  #   @link_node.description = nil
  #   @link_node.start_date = Time.zone.now
  #   assert_not @link_node.valid?
  #   @link_node.start_date = nil
  #   @link_node.end_date = Time.zone.now
  #   assert_not @link_node.valid?
  #   @link_node.end_date = nil
  # end

  # test "should delete node edges" do
  #   @node = nodes(:node_one)

  #   assert_difference 'Edge.count', -1 do
  #     @node.destroy
  #   end
  # end
end
