/**
 * Created by dystopian on 4/2/14.
 */

Boards = new Meteor.Collection('boards');
Cards = new Meteor.Collection('cards');

Meteor.publish('boards', function() {
    return Boards.find({members: this.userId});
});

Meteor.publish('users', function() {
    return Meteor.users.find({},{fields: {emails: 1}}) ;
});

Meteor.publish('cards', function() {
    var boards = Boards.find({members: this.userId}).fetch();
    var boardIds = [];
    for(board in boards) {
        boardIds.push(boards._id);
    }
    return Cards.find({board: {$in: boardIds}});
});

Boards.allow({
    insert: function(user_id, doc) {
        return doc.owner_id === user_id;
    },
    update: function(user_id, doc) {
        return doc.owner_id === user_id || doc.members.indexOf(user_id) != -1;
    },
    remove : function(user_id, doc) {
        return doc.owner_id === user_id;
    }
});

Cards.allow({
   insert: function(user_id, doc) {
        return doc.owner_id === user_id;
    },
    update: function(user_id, doc) {
        return doc.owner_id === user_id;
    },
    remove : function(user_id, doc) {
        return doc.owner_id === user_id;
    }
});