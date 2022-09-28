window.TrelloPowerUp.initialize({
  "card-badges": function (t, opts) {
    //    let cardAttachments = opts.attachments; // Trello passes you the attachments on the card
    return t.card("all").then(function (card) {
      console.log(card);
      return [
        {
          text: card.idShort,
        },
      ];
    });
  },
});
