(function() {
  var Api;

  Api = (function() {
    function Api() {}

    Api.get_graph = function() {
      return $.get('/territories');
    };

    Api.show_graph = function(id) {
      return $.get('/territories/' + id);
    };

    Api.delete_node = function(id) {
      return $.ajax({
        url: '/nodes/' + id,
        method: 'DELETE'
      });
    };

    Api.create_edge = function(category, source_id, target_id) {
      return $.post('/edges/', {
        'edge[category]': category,
        'edge[source_id]': source_id,
        'edge[target_id]': target_id
      });
    };

    Api.update_edge = function(id, source_id, target_id, category) {
      return $.ajax({
        url: '/edges/' + id,
        method: 'PATCH',
        data: {
          'edge[source_id]': source_id,
          'edge[target_id]': target_id,
          'edge[category]': category
        }
      });
    };

    Api.delete_edge = function(id) {
      return $.ajax({
        url: '/edges/' + id,
        method: 'DELETE'
      });
    };

    Api.create_node = function(data) {
      return $.post('/nodes', data);
    };

    Api.update_node = function(id, data) {
      return $.ajax({
        url: '/nodes/' + id,
        method: 'PATCH',
        data: data
      });
    };

    Api.delete_node = function(id) {
      return $.ajax({
        url: '/nodes/' + id,
        method: 'DELETE'
      });
    };

    Api.get_territory = function(id) {
      return $.get('/territories/' + id);
    };

    Api.create_territory = function(name, is_template, is_public) {
      return $.post('/territories/', {
        'territory[name]': name,
        'territory[template]': is_template,
        'territory[public]': is_public
      });
    };

    Api.delete_territory = function(id) {
      return $.ajax({
        url: '/territories/' + id,
        method: 'DELETE'
      });
    };

    Api.clone_territory = function(id, name, is_template, is_public) {
      return $.ajax({
        url: '/territories/' + id + '/clone',
        method: 'POST',
        data: {
          'territory[name]': name,
          'territory[template]': is_template,
          'territory[public]': is_public
        }
      });
    };

    Api.update_territory = function(id, name, is_template, is_public) {
      return $.ajax({
        url: '/territories/' + id,
        method: 'PATCH',
        data: {
          'territory[name]': name,
          'territory[template]': is_template,
          'territory[public]': is_public
        }
      });
    };

    Api.get_node = function(id) {
      return $.get('/nodes/' + id);
    };

    Api.get_edge = function(id) {
      return $.get('/edges/' + id);
    };

    Api.edit_node = function(id, title) {
      return $.ajax({
        url: '/nodes/' + id,
        method: 'PATCH',
        data: {
          'node[title]': title
        }
      });
    };

    Api.bulk_update_pos = function(nodes_pos) {
      return $.ajax({
        url: '/nodes/position',
        method: 'PATCH',
        data: {
          nodes: nodes_pos
        }
      });
    };

    Api.create_styling_group = function(name, color) {
      return $.post('/styling_groups/', {
        'styling_group[name]': name,
        'styling_group[color]': color
      });
    };

    Api.get_styling_group = function(id) {
      return $.get('/styling_groups/' + id);
    };

    Api.edit_styling_group = function(id, name, color) {
      return $.ajax({
        url: '/styling_groups/' + id,
        method: 'PATCH',
        data: {
          'styling_group[name]': name,
          'styling_group[color]': color
        }
      });
    };

    Api.delete_styling_group = function(id) {
      return $.ajax({
        url: '/styling_groups/' + id,
        method: 'DELETE'
      });
    };

    return Api;
  })();
)();
