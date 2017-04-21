function(doc, req) {
  var o = JSON.parse(req.body);
  if (doc) {
    o._id = doc._id;
    return [o, "Updated!"];
  }
  o._id = o._id || req.id || req.uuid;
  o.created_at = new Date().toUTCString();
  return [o, "Created at " + o.created_at];
}
