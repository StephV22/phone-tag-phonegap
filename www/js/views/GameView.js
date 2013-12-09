define(['backbone', 'handlebars', '../templates/game','./MapView'], function(Backbone, Handlebars, GameTemplate, MapView){
  var GameView = Backbone.View.extend({
    template: Handlebars.compile(GameTemplate),

    initialize: function(options){
      this.render();

      new MapView({game: this.model, currentPlayer: this.model.get('currentPlayer'), socket: options.socket});
      this.model.on('startGame', this.startGame, this);
      this.model.on('renderScores', this.renderScores, this);
    },

    startGame: function(){
      var secToStart, timeLeft, minLeft, secLeft;
      var startTime = this.model.endTime - (this.model.get('timeLimit') * 60 * 1000);
      var that = this;
      $('#container').append('<div class="timer"></div>');
      var gameTimer = setInterval(function(){
        if (Date.now() >= startTime && Date.now() < that.model.endTime) {
          timeLeft = that.model.endTime - Date.now();
          minLeft = Math.floor(timeLeft / (60 * 1000));
          secLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);
          if (secLeft < 10) {
            secLeft = '0'+secLeft;
          }
          $('.timer').html('<p>'+minLeft+':'+secLeft+'</p>');
        } else if (Date.now() < startTime) {
          secToStart = Math.floor((startTime - Date.now()) / 1000);
          $('.timer').html('<p>Game starting in '+secToStart+' seconds.</p>');
        } else {
          $('.timer').html('<p>0:00</p>');
          clearInterval(gameTimer);
          that.model.endGame();
        }
      }, 1000);
    },

    renderScores: function(data){
      var that = this;
      $('#container').append('<section class="scoreboard"></section>');
      $('#container').append('<section class="modalMask"></section>');
      $('.scoreboard').append('<table><tr><th>Name</th><th>Kills</th><th>Deaths</th><th>Attempted Tags</th><th>Tags/min</th></tr></table>');
      _.each(data, function(player){
        $('.scoreboard tbody').append('<tr><td>' + player.name + '</td><td>' + player.kills + '</td><td>' + player.deaths + '</td><td>' + player.totalTags + '</td><td>' + player.totalTags / that.model.get('timeLimit') + '</td></tr>');
      });

      // // If there is a winner, animate the winner;
      // if(data.winner){
      //   this.model.trigger('animateWinner', data.winner);
      // }
    },

    render: function(){
      $('#container').html(this.template);
      return this;
    }

  });
  return GameView;
});
