var ToDoApp = {
  init: function() {
    this.socket = new Phoenix.Socket("/ws");
    this.toDoListContainer = $("#to_do_list_container");
    this.toDoList = $("#to_do_list");
    this.doneList = $("#done_list");
    this.newItem = $("#new_item");
    this.sortableCollection = {}; 
    var app = this;
    this.socket.join("to_dos", "list", {}, function(channel) {
      app.bindAndListenToEvents(channel);
    });
  },

  bindAndListenToEvents: function(channel) {
    this.bindEventsForCreatingItem(channel);
    this.listenToCreatingItemEvent(channel);

    this.bindEventsForTogglingItem(channel);
    this.listenToTogglingItemEvent(channel);

    this.bindEventsForDeletingItem(channel);
    this.listenToDeletingItemEvent(channel);

    this.bindEventsForEditingItem();
    this.bindEventsForUpdatingItem(channel);
    this.listenToUpdatingItemEvent(channel);
   
    this.bindEventsForArrangingItems(channel);
    this.listenToArrangingItemsEvent(channel);
  },
 
  bindEventsForArrangingItems: function(channel) {
    var app = this;
    $("span.arrange-items").click(function() {
      var forList = $(this).attr("for");
      var listUl = $(forList);
      listUl.toggleClass("arranging");
      if(listUl.hasClass("arranging")) {
        $(this).html("I'm done with arrangement");
        var sortable = new Sortable(listUl.get(0), {
          ghostClass: "sortable-ghost",
          onUpdate: function(event) {
            var listOfOrderedIds = [];
            listUl.find("li").each(function(index) {
              listOfOrderedIds.push($(this).find("input.item-done").attr("id").replace("item_", ""));
            });
            channel.send("arrange:items", {item_ids: listOfOrderedIds.join(","), for_list: forList});
          }
        });
        app.sortableCollection[forList] = sortable;
      }//end if
      else {
        $(this).html("Arrange Items");
        app.sortableCollection[forList].destroy();
        app.sortableCollection[forList] = null;
      }//end else
    });
  },

  listenToArrangingItemsEvent: function(channel) {
    channel.on('arrange:items', function(data) {
      var itemIds = data["item_ids"];
      var forList = data["for_list"];
      var listUl = $(forList);
      var itemIdsArray = itemIds.split(",");
      var sortable = new Sortable(listUl.get(0));
      sortable.sort(itemIdsArray);
      sortable.destroy();
    });
  }, 

  bindEventsForCreatingItem: function(channel) {
    var app = this;
    this.newItem.off("keypress").on("keypress", function(e){
      if(e.keyCode == 13){
        channel.send("create:item", {
          description: app.newItem.val(),
        });
        app.newItem.val("");
      }
    });
  },

  listenToCreatingItemEvent: function(channel) {
    var app = this;
    channel.on("create:item", function(data){
      app.toDoList.append(data.item_html);
    });
  },

  bindEventsForTogglingItem: function(channel) {
    var app = this;
    app.toDoListContainer.delegate("input.item-done", "click", function(e) {
      channel.send("toggle:item", {item_id: $(this).attr("id").replace("item_", "")});
    });
  },

  listenToTogglingItemEvent: function(channel) {
    var app = this;
    channel.on("toggle:item", function(data){
      var item = data.item;

      var targetItemList = app.toDoList;
      var fromItemList = app.doneList;
      if(item.done == 1) {
        targetItemList = app.doneList;
        fromItemList = app.toDoList;
      }

      fromItemList.find("#item_" + item.id).parent().fadeOut(function() {
        targetItemList.prepend($(this).fadeIn());
      });
    });
  },

  bindEventsForUpdatingItem: function(channel) {
    var app = this;
    app.toDoListContainer.delegate("span.edit-item-description input", "keypress", function(e) {
      if(e.keyCode == 13) {
        var newDescription = $(this).val();
        var parent = $(this).parents("li:first");
        var itemDescription = parent.find("span.item-description");
        var itemCheckBox = parent.find("input.item-done");
        var editItemLink = parent.find("span.edit-item");
        var editItemDescription = parent.find("span.edit-item-description");
        itemDescription.html(newDescription).toggleClass("hidden");
        editItemDescription.toggleClass("hidden");
        editItemLink.html("edit");
        
        channel.send("update:item", {
          item_id: itemCheckBox.attr("id").replace("item_", ""), 
          description: newDescription
        });
      }//end if
    });
  },

  bindEventsForEditingItem: function() {
    this.toDoListContainer.delegate("span.edit-item", "click", function(e) {
      var itemDescription = $(this).parent().find("span.item-description");
      var editItemDescription = $(this).parent().find("span.edit-item-description");
      itemDescription.toggleClass("hidden"); 
      editItemDescription.toggleClass("hidden").find("input").val(itemDescription.html()).focus();
      if($(this).hasClass("cancel-edit-item")) {
        $(this).html("edit");
      } else {
        $(this).html("cancel");
      }//end else
      $(this).toggleClass("cancel-edit-item");
    });
  },

  listenToUpdatingItemEvent: function(channel) {
    var app = this;
    channel.on("update:item", function(data) {
      var item = data.item;
      app.toDoListContainer.find("#item_" + item.id)
          .parent().find("span.item-description").html(item.description);
    });
  },

  bindEventsForDeletingItem: function(channel) {
    var app = this;
    app.toDoListContainer.delegate("span.delete-item", "click", function(e) {
      var parent = $(this).parent();
      parent.fadeOut(function() {
        $(this).remove();
        var itemCheckBox = parent.find("input.item-done");
        channel.send("delete:item", {item_id: itemCheckBox.attr("id").replace("item_", "")});
      });
    });
  },

  listenToDeletingItemEvent: function(channel) {
    var app = this;
    channel.on("delete:item", function(data) {
      var item = data.item;
      app.toDoListContainer.find("#item_" + item.id).parent().fadeIn(function() {
        $(this).remove();
      });
    });
  }
}
