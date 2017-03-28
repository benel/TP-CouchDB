function(o, req) {
  var templates = require('lib/mustache');

  provides('atom', function() {
    return templates.render(this.templates.atom, o);
  });

  provides('json', function() {
    delete o._revisions;
    return JSON.stringify(o);
  });
}
