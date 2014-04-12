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

getCurrentBoard = function(){
    var board = Boards.find({_id:gget('b_id')}).fetch()[0];
    return board;
}

Meteor.subscribe('boards');
Meteor.subscribe('cards');
Meteor.subscribe('users');

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

    },

    'click #shareWith': function(event, template){
        //console.log(this)
        Boards.update(
            { _id: gget('b_id') },
            { $addToSet: { members: this._id } }
        )
    },

    'click #UnshareWith': function(event, template){

        //console.log(this)
        Boards.update(
            { _id: gget('b_id') },
            { $pull: { members: this._id } }
        )
    },

    'click #addCard' : function(event,template){
        if(!(template.find('.inptextCard') && template.find('.inptextCard').value)){
            return;
        }

        var cardName = template.find('.inptextCard').value
        Cards.insert({
            board_id: gget('b_id'),
            owner_id: Meteor.user()._id,
            name: cardName
        });

        template.find('.inptextCard').value = ''
    }

});

Template.orghome.helpers({
    isLoggedIn:function(){
        return Meteor.user()
    },
    boards: function() {

        return Boards.find({name: { $ne: ''}}).fetch();

    },
    board: function(){
        var board = Boards.find({_id:gget('b_id')}).fetch()[0];
        return board;
    },
    owner: function(user_id) {
        return Meteor.users.find({_id: user_id}).fetch()[0].emails[0].address;
    },
    boardUsers: function(){

         if(getCurrentBoard()){
            var users = Meteor.users.find({_id: {$in: getCurrentBoard().members }}).fetch()
            //console.log(users);
            return users;
        }
    },
    getAddress:function(emails){
        return emails[0].address;
    },
    showShareBtn:function(_id){
        return getCurrentBoard() && _id && Meteor.user() && Meteor.user()._id != _id && getCurrentBoard().members.indexOf(_id) == -1 ;
    },

    showUnshareBtn:function(_id){
        return getCurrentBoard() && _id && Meteor.user() && (Meteor.user()._id != _id && Meteor.user()._id == getCurrentBoard().owner_id) || ((Meteor.user()._id == _id && Meteor.user()._id != getCurrentBoard().owner_id));
    },

    users: function(){
        return Meteor.users.find().fetch()
    },

    cards: function() {

        if(gget('b_id')){
            return Cards.find({board_id: gget('b_id')}).fetch();
        }
    }
});
