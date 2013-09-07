chrome.bookmarks.create({'parentId': bookmarkBar.id,
                         'title': 'Extension bookmarks'},
                        function(newFolder) {
  console.log("added folder: " + newFolder.title);
});