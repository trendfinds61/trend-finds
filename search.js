// Trend Finds homepage search — filters the post list using search.json.
// Pure matching function (testable): returns items whose title or labels
// contain every word of the query (case-insensitive).
function searchPosts(query, items) {
  var words = query.toLowerCase().split(/\s+/).filter(function (w) { return w; });
  if (!words.length) return items;
  return items.filter(function (it) {
    var hay = (it.title + " " + it.labels.join(" ")).toLowerCase();
    return words.every(function (w) { return hay.indexOf(w) !== -1; });
  });
}
if (typeof document !== "undefined") {
  var box = document.getElementById("search-box");
  var list = document.getElementById("post-list");
  var count = document.getElementById("search-count");
  var index = null;
  function apply() {
    if (!index) return;
    var hits = searchPosts(box.value, index);
    var keep = {};
    hits.forEach(function (h) { keep[h.path] = true; });
    var shown = 0;
    Array.prototype.forEach.call(list.children, function (li) {
      var show = !!keep[li.getAttribute("data-path")];
      li.style.display = show ? "" : "none";
      if (show) shown++;
    });
    count.textContent = shown === index.length
      ? "Showing all " + index.length + " reviews."
      : "Showing " + shown + " of " + index.length + " reviews.";
  }
  fetch("/search.json").then(function (r) { return r.json(); }).then(function (data) {
    index = data;
    box.addEventListener("input", apply);
  });
}
if (typeof module !== "undefined") module.exports = { searchPosts: searchPosts };
