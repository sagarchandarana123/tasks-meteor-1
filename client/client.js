/**
 * Created by dystopian on 4/2/14.
 */
Boards = new Meteor.Collection('boards');
Cards = new Meteor.Collection('cards');

Meteor.subscribe('boards');
Meteor.subscribe('cards');

Template.orghome.events({
    'click #addBoard': function(event, template) {
        var boardName = template.find('.inptext').value;

        Boards.insert({
            owner_id: Meteor.user()._id,
            name: boardName,
            members: [Meteor.user()._id]
        });

        template.find('.inptext').value = "";
    },
    'click .boardSelect': function(event, template) {
        var boardid = template.find(".boardWrapper div").value;
        console.log(boardid);
    }
});

Template.content.helpers({
    currentPage: function(type) {
        return Session.get("currentPage") === type;
    }
});
Template.orghome.helpers({
    boards: function() {
        return Boards.find({}).fetch();
    },
    owner: function(user_id) {
        return Meteor.users.find({_id: user_id}).fetch()[0].emails[0].address;
    }
});

Session.set("currentPage", "orghome");