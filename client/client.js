/**
 * Created by dystopian on 4/2/14.
 */ 
Boards = new Meteor.Collection('boards');
Cards = new Meteor.Collection('cards');

sset = function(vari,val){
    Session.set(vari,val);
}

gget = function(vari){
    return Session.get(vari);
}

Meteor.subscribe('boards');
Meteor.subscribe('cards');


Template.orghome.events({
    'click #addBoard': function(event, template) {
        if(template.find('.inptextBoard') && template.find('.inptextBoard').value){
            var boardName = template.find('.inptextBoard').value;

            Boards.insert({
                owner_id: Meteor.user()._id,
                name: boardName,
                members: [Meteor.user()._id]
            });

            template.find('.inptextBoard').value = ''
        }
    },
    'click .boardSelect': function(event, template) {
        sset('b_id',event.currentTarget.id);
        console.log(gget('b_id'));
    },

    'click #addCard' : function(event,template){
        if(!(template.find('.inptextCard') && template.find('.inptextCard').value)){
            return;
        }

        var cardName = template.find('.inptextCard').value
        Cards.insert({
            board_id: gget('b_id'),
            owner_id: Meteor.user()._id,
            name: cardName,
        });

        template.find('.inptextCard').value = ''
    }

});

Template.orghome.helpers({
    boards: function() {
        console.log(Boards.find({name: { $ne: ''}}).fetch())
        return Boards.find({name: { $ne: ''}}).fetch();

    },
    board: function(){
        var board = Boards.find({_id:gget('b_id')}).fetch()[0];
        sset('brd',board);
        return board;
    },
    owner: function(user_id) {
        return Meteor.users.find({_id: user_id}).fetch()[0].emails[0].address;
    },
    boardUsers: function(){
         if(gget('board')){
            var users = Meteor.users.find({_id: {$in: gget('board').members }}).fetch()

            return users;
        }
    },

    cards: function() {
        console.log(gget('b_id'));
        if(gget('b_id')){
            return Cards.find({board_id: gget('b_id')}).fetch();
        }
    },
});
